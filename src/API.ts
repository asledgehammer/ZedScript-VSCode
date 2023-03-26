/* eslint-disable no-inner-declarations */
import { LexerBag, LexerOptions, LexerToken } from './Lexer';

function checkProperty(bag: LexerBag, property: string, categories: string[] | string, categoryGiven: string) {
    const catLower = categoryGiven.toLowerCase();
    if (typeof categories === 'string') categories = [categories];
    for (const catExp of categories) {
        const catExpLower = catExp.toLowerCase();
        if (catLower === catExpLower) {
            return;
        }
    }

    const cats = `[${categories.map((o) => o.toLowerCase()).join(', ')}]`;
    bag.error(`Cannot define ${property} in '${catLower}'. It is only allowed in ${cats}'.`);
}

function stepInOpenBracket(bag: LexerBag): string {
    if (bag.peek() === '{') {
        const start = bag.cursor();
        bag.next();
        const stop = bag.cursor();
        const token: LexerToken = { value: '{' };
        if (bag.options.location) token.loc = { start, stop };
        bag.tokens.push(token);
        return '{';
    }

    let value;
    do {
        value = bag.next();
    } while (value !== '{' && value != null);
    const start = bag.cursor(bag.offset - 1);
    const stop = bag.cursor();

    if (value === undefined) {
        bag.error(`Unexpected EOF. (Expected '{')`);
    }

    if (value !== '{') {
        bag.error(`Unexpected ${value}. (Expected: '{', Given: '${value}')`);
    }

    const token: LexerToken = { value };
    if (bag.options.location) token.loc = { start, stop };
    bag.tokens.push(token);

    return '{';
}

function stepInObjectName(bag: LexerBag): string {
    const start = bag.cursor();
    let value = bag.until(['{', '\n'])!.trim();
    if (value === '') bag.error('Name is empty.');

    // Preserve the '{' so the lexer doesn't break on inline-bracing.
    if(value.indexOf('{') === value.length - 1) {
        value = value.substring(0, value.length - 1).trim();
        bag.offset--;
    }

    const stop = bag.cursor(bag.offset - 1);
    const token: LexerToken = { value };
    if (bag.options.location) token.loc = { start, stop };
    bag.tokens.push(token);
    return value;
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function stepInProperty(
    bag: LexerBag,
    module: string,
    definition: string,
    property: string,
    operator: '=' | ':',
    removeWhitespace = true
) {
    const propLower = property.toLowerCase();

    if (property.indexOf(' ') !== -1) {
        const [cat, name] = property.split(' ');
        bag.token(cat.toLowerCase(), bag.cursor(), bag.cursor(bag.offset - (property.length - cat.length)));
        bag.token(name, bag.cursor(bag.offset - (property.length - cat.length) + 1), bag.cursor());
    } else {
        bag.token(propLower, bag.cursor(bag.offset - propLower.length), bag.cursor());
    }

    stepInOpenBracket(bag);

    while (!bag.isEOF()) {
        const start = bag.cursor();
        const line = bag.until([',', '}', '\n'])?.trim();
        const stop = bag.cursor();

        if (line == undefined) {
            bag.error(`Unexpected EOF in '${property}: ${module}.${definition}.${property}'`);
            return;
        } else if (line === '') {
            continue;
        } else if (line === '}') {
            bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
            break;
        }

        if (line.indexOf(operator) === -1) {
            if (line === ',') continue;
            bag.warn(`Illegal line in ${module}.${definition}.${property}: ${line}`);
        }

        let l = line.replace(/,/g, '');
        if (removeWhitespace) l = l.replace(/\s/g, '');
        bag.token(l, start, stop);
    }
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function stepInDefinition(
    bag: LexerBag,
    module: string,
    category: string,
    operator: '=' | ':',
    removeWhitespace = true
) {
    const catLower = category.toLowerCase();
    bag.token(catLower, bag.cursor(bag.offset - catLower.length), bag.cursor());
    const name = stepInObjectName(bag);
    stepInOpenBracket(bag);

    const brk = false;
    while (!brk && !bag.isEOF()) {
        const start = bag.cursor();
        const line = bag.until([',', '\n', '}'])?.trim();
        const stop = bag.cursor(bag.offset - 1);

        function space(line: string): boolean {
            const [cat] = line.split(' ').map((o) => {
                return o.trim();
            });
            const prop = cat.toLowerCase();
            switch (prop) {
                case 'attachment':
                    checkProperty(bag, prop, 'model', category);
                    stepInProperty(bag, module, name, line, '=', false);
                    return true;
            }
            return false;
        }

        function noSpace(line: string): boolean {
            const prop = line.toLowerCase();
            switch (prop) {
                case 'copyframe':
                    checkProperty(bag, prop, 'animation', category);
                    stepInProperty(bag, module, name, prop, '=');
                    return true;
                case 'copyframes':
                    checkProperty(bag, prop, 'animation', category);
                    stepInProperty(bag, module, name, prop, '=');
                    return true;
                case 'clip':
                    checkProperty(bag, prop, 'sound', category);
                    stepInProperty(bag, module, name, prop, '=');
                    return true;
                case 'data':
                    checkProperty(bag, prop, 'vehicleenginerpm', category);
                    stepInProperty(bag, module, name, prop, '=');
                    return true;
            }
            return false;
        }

        if (line == undefined) {
            bag.error(`EOF in ${category}: ${module}.${name}`);
            return;
        } else if (line === '') {
            continue;
        } else if (line === '}') {
            bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
            break;
        }

        if (line.indexOf(operator) !== -1) {
            if (removeWhitespace) {
                bag.token(line.replace(/,/g, '').replace(/\s/g, ''), start, stop);
            } else {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
            }
            continue;
        } else if (line === ',') {
            continue;
        }

        if (line.indexOf(' ') !== -1) {
            if (space(line)) continue;
        } else {
            if (noSpace(line)) continue;
        }

        bag.warn(`Illegal line in '${module}.${name}': ${line}`);
    }
}

function stepInRecipe(bag: LexerBag, module: string, category: string) {
    const catLower = category.toLowerCase();
    bag.token(catLower, bag.cursor(bag.offset - catLower.length), bag.cursor());
    const recipe = stepInObjectName(bag);
    stepInOpenBracket(bag);

    const brk = false;
    while (!brk && !bag.isEOF()) {
        const start = bag.cursor();
        const line = bag.until([',', '\n', '}'])?.trim();
        const stop = bag.cursor(bag.offset - 1);

        if (line == undefined) {
            bag.error(`Unexpected EOF in '${module}.${recipe}'`);
            return;
        } else if (line === '') {
            continue;
        } else if (line === '}') {
            bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
            break;
        }

        bag.token(line.replace(/,/g, '').replace(/\s/g, ''), start, stop);
    }
}

function stepInImports(bag: LexerBag, module: string) {
    bag.token('imports', bag.cursor(bag.offset - 'imports'.length), bag.cursor());
    stepInOpenBracket(bag);
    while (!bag.isEOF()) {
        const start = bag.cursor();
        const line = bag.until([',', '\n', '}'])?.trim().replace(',', '');
        const stop = bag.cursor(bag.offset - 1);

        if (line == undefined) {
            bag.error(`Unexpected EOF in '${module}.Imports'`);
            return;
        } else if (line === '') {
            continue;
        } else if (line === '}') {
            bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
            break;
        }

        bag.token(line, start, stop);
    }
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function stepInModule(bag: LexerBag) {
    const module = stepInObjectName(bag);

    stepInOpenBracket(bag);

    let brk = false;
    while (!brk && !bag.isEOF()) {
        const word = bag.until([' ', '\n', '}'])?.trim();
        if (word === undefined) {
            bag.error(`EOF in module: ${module}`);
            return;
        }

        const wordLower = word.toLowerCase();
        switch (wordLower) {
            /* (TERMINATOR) */
            case '}':
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                brk = true;
                break;
            case '':
                continue;
            case 'imports':
                stepInImports(bag, module);
                break;

            /* (Definitions using '=' assignments) */
            case 'item':
                stepInDefinition(bag, module, wordLower, '=', false);
                break;

            case 'animation':
            case 'animationsmesh':
            case 'mannequin':
            case 'model':
            case 'sound':
            case 'soundtimeline':
                stepInDefinition(bag, module, wordLower, '=');
                break;

            case 'vehicleenginerpm':
                stepInDefinition(bag, module, wordLower, '=', false);
                break;

            /* (Definitions using ':' assignments) */
            case 'fixing':
            case 'multistagebuild':
                stepInDefinition(bag, module, wordLower, ':');
                break;

            /* (Recipe Definitions) */
            case 'evolvedrecipe':
            case 'recipe':
            case 'uniquerecipe':
                stepInRecipe(bag, module, wordLower);
                break;

            /* (Vehicles) */
            case 'template':
                stepInVehicle(bag, module, true);
                break;
            case 'vehicle':
                stepInVehicle(bag, module, false);
                break;

            default:
                bag.warn('Unknown category: "' + wordLower + '"');
        }
    }
}

function stepInVersion(bag: LexerBag) {
    const expectsEquals = bag.until(['=']);
    if (expectsEquals === undefined) {
        bag.error('Unexpected EOF in version declaration.');
        return;
    }
    if (expectsEquals.indexOf('=') !== expectsEquals.length - 1) {
        bag.error("Expected '=' in version declaration.");
    }

    bag.token('=', bag.cursor(bag.offset - 2), bag.cursor(bag.offset - 1));

    let versionActual = bag.until([',', '\n']);
    if (versionActual === undefined) {
        bag.error('Unexpected EOF in version declaration.');
        return;
    }
    versionActual = versionActual.trim().replace(/,/g, '');
    if (versionActual === '') {
        bag.error('Version is empty in version declaration.');
        return;
    }

    bag.token(versionActual, bag.cursor(bag.offset - versionActual.length), bag.cursor(bag.offset - 1));
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function stepInVehicle(bag: LexerBag, module: string, isTemplate: boolean) {
    let name = '';
    /* (Token the 'vehicle' or 'template vehicle') */
    if (isTemplate) {
        const iOffset = bag.offset - 'template vehicle'.length;
        bag.token('template vehicle', bag.cursor(iOffset), bag.cursor());
        name = bag.until(['\n', '{'], true)!.split(' ')[1];
    } else {
        const iOffset = bag.offset - 'vehicle'.length;
        bag.token('vehicle', bag.cursor(iOffset), bag.cursor());
        name = bag.until(['\n', '{'], true)!.split(' ')[0];
    }

    /* (Tokenize the name & opening bracket) */
    const start = bag.cursor();
    const stop = bag.cursor(bag.offset - 1);
    bag.token(name, start, stop);
    stepInOpenBracket(bag);

    /* (All named object constructors go here) */
    const space = (line: string): boolean => {
        const [cat, catName] = line.split(' ').map((o) => {
            return o.trim();
        });
        // console.log({ vehicleSpaceLine: line, cat });
        switch (cat.toLowerCase()) {
            case 'area':
                stepInArea(bag, `${module}.${name}`, catName);
                return true;
            case 'attachment':
                stepInAttachment(bag, `${module}.${name}`, catName);
                return true;
            case 'part':
                stepInPart(bag, `${module}.${name}`, catName);
                return true;
            case 'passenger':
                stepInPassenger(bag, `${module}.${name}`, catName);
                return true;
            case 'physics':
                stepInPhysics(bag, `${module}.${name}`, catName);
                return true;
            case 'wheel':
                stepInWheel(bag, `${module}.${name}`, catName);
                return true;
        }
        return false;
    };

    /* (All non-named object constructors go here) */
    const noSpace = (line: string): boolean => {
        const lineLower = line.toLowerCase();
        // console.log({ vehicleNoSpaceLine: line });
        switch (lineLower) {
            case 'lightbar':
                stepInLightbar(bag, `${module}.${name}`);
                return true;
            case 'model':
                stepInModel(bag, `${module}.${name}`);
                return true;
            case 'skin':
                stepInSkin(bag, `${module}.${name}`);
                return true;
            case 'sound':
                stepInSound(bag, `${module}.${name}`);
                return true;
        }
        return false;
    };

    while (!bag.isEOF()) {
        const start = bag.cursor();
        const line = bag.until([',', '\n', '}'])?.trim();
        const stop = bag.cursor(bag.offset - 1);

        /* (We shouldn't get here) */
        if (line == undefined) {
            bag.error(`EOF in vehicle: ${module}.${name}`);
            return;
        } else if (line === '') continue;
        /* (End of object) */ else if (line === '}') {
            bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
            break;
        }

        /* (If the line is a classic 'property = value') */
        if (line.indexOf('=') !== -1) {
            bag.token(line.replace(/,/g, '').trim(), start, stop);
            continue;
        } else if (line === ',') continue;

        if (line.indexOf(' ') !== -1) {
            if (space(line)) continue;
        } else {
            if (noSpace(line)) continue;
        }

        bag.warn(`Illegal line in '${module}.${name}': ${line}`);
        break;
    }

    function stepInArea(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `area ${name}`.length;
        bag.token('area', bag.cursor(iOffset), bag.cursor());
        bag.token(name, bag.cursor(bag.offset - (name.length + 1)), bag.cursor());

        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.Area[${name}]'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.Area[${name}]': ${line}`);
            break;
        }
    }

    function stepInAttachment(bag: LexerBag, parent: string, name: string) {
        /* (Token the 'vehicle' or 'template vehicle') */
        const iOffset = bag.offset - `attachment ${name}`.length;
        bag.token('attachment', bag.cursor(iOffset), bag.cursor());
        bag.token(name, bag.cursor(bag.offset - (name.length + 1)), bag.cursor());

        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.Attachment[${name}]'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.Attachment[${name}]': ${line}`);
            break;
        }
    }

    function stepInPart(bag: LexerBag, parent: string, name: string) {
        /* (Token the 'vehicle' or 'template vehicle') */
        const iOffset = bag.offset - `part ${name}`.length;
        bag.token('part', bag.cursor(iOffset), bag.cursor());
        bag.token(name, bag.cursor(bag.offset - (name.length + 1)), bag.cursor());

        stepInOpenBracket(bag);

        /* (All named object constructors go here) */
        const space = (line: string): boolean => {
            const [cat, catName] = line.split(' ').map((o) => {
                return o.trim();
            });
            // console.log({ partSpaceLine: line, cat });
            switch (cat.toLowerCase()) {
                case 'anim':
                    stepInAnim(bag, `${parent}.${name}`, catName);
                    return true;
                case 'model':
                    stepInPartModel(bag, `${parent}.${name}`, catName);
                    return true;
                case 'table':
                    stepInTable(bag, `${parent}.${name}`, catName);
                    return true;
            }
            return false;
        };

        /* (All non-named object constructors go here) */
        const noSpace = (line: string): boolean => {
            const cat = line.toLowerCase();
            // console.log({ partNoSpaceLine: line, cat });
            switch (cat) {
                case 'container':
                    stepInContainer(bag, `${parent}.${name}`);
                    return true;
                case 'door':
                    stepInDoor(bag, `${parent}.${name}`);
                    return true;
                case 'install':
                    stepInInstall(bag, `${parent}.${name}`);
                    return true;
                case 'lua':
                    stepInLua(bag, `${parent}.${name}`);
                    return true;
                case 'uninstall':
                    stepInUninstall(bag, `${parent}.${name}`);
                    return true;
                case 'window':
                    stepInWindow(bag, `${parent}.${name}`);
                    return true;
            }
            return false;
        };

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.Part[${name}]'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            if (line.indexOf(' ') !== -1) {
                if (space(line)) continue;
            } else {
                if (noSpace(line)) continue;
            }

            bag.warn(`Illegal line in '${parent}.Part[${name}]': ${line}`);
            break;
        }
    }

    function stepInAnim(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `anim ${name}`.length;
        bag.token('anim', bag.cursor(iOffset), bag.cursor(bag.offset - ` ${name}`.length));
        bag.token(name, bag.cursor(bag.offset - ` ${name}`.length), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`EOF in part: ${parent}.${name}.anim`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }
    function stepInContainer(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - `container`.length;
        bag.token('container', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.${name}.container'.`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.container': ${line}`);
            break;
        }
    }

    function stepInDoor(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - `door`.length;
        bag.token('door', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`EOF in door: ${parent}.${name}.door`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }

    function stepInInstall(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - `install`.length;
        bag.token('install', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.install'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.install': ${line}`);
            break;
        }
    }

    function stepInLightbar(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - `lightbar`.length;
        bag.token('lightbar', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.lightbar'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.lightbar': ${line}`);
            break;
        }
    }

    function stepInModel(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - `model`.length;
        bag.token('model', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.model'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.model': ${line}`);
            break;
        }
    }

    function stepInPartModel(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `model ${name}`.length;
        bag.token('model', bag.cursor(iOffset), bag.cursor(bag.offset - ` ${name}`.length));
        bag.token(name, bag.cursor(bag.offset - ` ${name}`.length), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.${name}'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }

    function stepInPassenger(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `passenger ${name}`.length;
        bag.token('passenger', bag.cursor(iOffset), bag.cursor(bag.offset - ` ${name}`.length));
        bag.token(name, bag.cursor(bag.offset - ` ${name}`.length), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        /* (All named object constructors go here) */
        const space = (line: string): boolean => {
            const [cat, catName] = line.split(' ').map((o) => {
                return o.trim();
            });
            // console.log({ passengerSpaceLine: line, cat });
            switch (cat.toLowerCase()) {
                case 'anim':
                    stepInAnim(bag, `${parent}.${name}`, catName);
                    return true;
                case 'position':
                    stepInPosition(bag, `${parent}.${name}`, catName);
                    return true;
                case 'switchseat':
                    stepInSwitchSeat(bag, `${parent}.${name}`, catName);
                    return true;
            }
            return false;
        };

        /* (All non-named object constructors go here) */
        const noSpace = (line: string): boolean => {
            const cat = line.toLowerCase();
            // console.log({ tableNoSpaceLine: line, cat });
            switch (cat) {
                case 'items':
                    stepInItems(bag, `${parent}.${name}.${line}`);
                    return true;
            }
            return false;
        };

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.${name}'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            if (line.indexOf(' ') !== -1) {
                if (space(line)) continue;
            } else {
                if (noSpace(line)) continue;
            }

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }

    function stepInPosition(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `position ${name}`.length;
        bag.token('position', bag.cursor(iOffset), bag.cursor(bag.offset - ` ${name}`.length));
        bag.token(name, bag.cursor(bag.offset - ` ${name}`.length), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.${name}'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }

    function stepInSkin(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - `skin`.length;
        bag.token('skin', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.skin'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.skin': ${line}`);
            break;
        }
    }

    function stepInSound(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - `sound`.length;
        bag.token('sound', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.sound'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.sound': ${line}`);
            break;
        }
    }

    function stepInSwitchSeat(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `switchseat ${name}`.length;
        bag.token('switchseat', bag.cursor(iOffset), bag.cursor(bag.offset - ` ${name}`.length));
        bag.token(name, bag.cursor(bag.offset - ` ${name}`.length), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.${name}'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }

    function stepInTable(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `table ${name}`.length;
        bag.token('table', bag.cursor(iOffset), bag.cursor(bag.offset - ` ${name}`.length));
        bag.token(name, bag.cursor(bag.offset - ` ${name}`.length), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        /* (All named object constructors go here) */
        const space = (line: string): boolean => {
            const [cat] = line.split(' ').map((o) => {
                return o.trim();
            });
            // console.log({ tableSpaceLine: line, cat });
            return false;
        };

        /* (All non-named object constructors go here) */
        const noSpace = (line: string): boolean => {
            const cat = line.toLowerCase();
            // console.log({ tableNoSpaceLine: line, cat });
            switch (cat) {
                case 'items':
                    stepInItems(bag, `${parent}.${name}.${line}`);
                    return true;
            }
            return false;
        };

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`EOF in part: ${module}.${name}`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            if (line.indexOf(' ') !== -1) {
                if (space(line)) continue;
            } else {
                if (noSpace(line)) continue;
            }

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }

    function stepInItems(bag: LexerBag, parent: string) {
        /* (Token the 'vehicle' or 'template vehicle') */
        const iOffset = bag.offset - 'items'.length;
        bag.token('items', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the opening bracket) */
        stepInOpenBracket(bag);

        /* (All named object constructors go here) */
        const space = (line: string): boolean => {
            const [cat] = line
                .toLowerCase()
                .split(' ')
                .map((o) => {
                    return o.trim();
                });
            // console.log({ itemsNoSpaceLine: line, cat });
            return false;
        };

        /* (All non-named object constructors go here) */
        const noSpace = (line: string): boolean => {
            const index = line.toLowerCase().trim();
            const start = bag.cursor(bag.offset - index.length);
            const stop = bag.cursor();

            // console.log({ itemsNoSpaceLine: line, index });
            /* (Array Token) */
            bag.token(index, start, stop);
            stepInItem(bag, `${parent}.part`, index);
            return true;
        };

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`EOF in part: ${parent}.${name}`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            if (line.indexOf(' ') !== -1) {
                if (space(line)) continue;
            } else {
                if (noSpace(line)) continue;
            }

            bag.warn(`Illegal line in '${module}.${name}': ${line}`);
            break;
        }
    }

    function stepInItem(bag: LexerBag, parent: string, index: string) {
        /* (Tokenize the opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.Item[${name}]'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}[${index}]': ${line}`);
            break;
        }
    }

    function stepInLua(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - 'lua'.length;
        bag.token('lua', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in ${parent}.lua`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.lua': ${line}`);
            break;
        }
    }

    function stepInPhysics(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `physics ${name}`.length;
        bag.token('physics', bag.cursor(iOffset), bag.cursor(bag.offset - ` ${name}`.length));
        bag.token(name, bag.cursor(bag.offset - ` ${name}`.length), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.${name}'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            if (line.indexOf(' ') !== -1) {
                if (space(line)) continue;
            } else {
                if (noSpace(line)) continue;
            }

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }

    function stepInUninstall(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - `uninstall`.length;
        bag.token('uninstall', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.uninstall'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.uninstall': ${line}`);
            break;
        }
    }

    function stepInWheel(bag: LexerBag, parent: string, name: string) {
        const iOffset = bag.offset - `wheel ${name}`.length;
        bag.token('wheel', bag.cursor(iOffset), bag.cursor(bag.offset - ` ${name}`.length));
        bag.token(name, bag.cursor(bag.offset - ` ${name}`.length), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in '${parent}.${name}'`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.${name}': ${line}`);
            break;
        }
    }

    function stepInWindow(bag: LexerBag, parent: string) {
        const iOffset = bag.offset - 'window'.length;
        bag.token('window', bag.cursor(iOffset), bag.cursor());

        /* (Tokenize the name & opening bracket) */
        stepInOpenBracket(bag);

        while (!bag.isEOF()) {
            const start = bag.cursor();
            const line = bag.until([',', '\n', '}'])?.trim();
            const stop = bag.cursor(bag.offset - 1);

            /* (We shouldn't get here) */
            if (line == undefined) {
                bag.error(`Unexpected EOF in ${parent}.window`);
                return;
            } else if (line === '') continue;
            /* (End of object) */ else if (line === '}') {
                bag.token('}', bag.cursor(bag.offset - 1), bag.cursor());
                break;
            }

            /* (If the line is a classic 'property = value') */
            if (line.indexOf('=') !== -1) {
                bag.token(line.replace(/,/g, '').trim(), start, stop);
                continue;
            } else if (line === ',') continue;

            bag.warn(`Illegal line in '${parent}.window': ${line}`);
            break;
        }
    }
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const tokenize = (
    path: string,
    options: Partial<LexerOptions> = { location: false }
): { tokens: LexerToken[] | string[]; comments?: LexerToken[] | string[] } => {
    const bag = new LexerBag(path, options);

    while (!bag.isEOF()) {
        const start = bag.cursor();
        const word = bag.until([' ', '\n'])?.trim();
        const stop = bag.cursor(bag.offset - 1);

        if (word == undefined) break;
        else if (word === '') continue;
        const wordLower = word.toLowerCase();
        switch (wordLower) {
            case 'module':
                bag.token('module', start, stop);
                stepInModule(bag);
                break;
            case 'option':
                stepInDefinition(bag, '[root]', 'option', '=', false);
                break;
            case 'version':
                bag.token('version', start, stop);
                stepInVersion(bag);
                break;
            default:
                bag.warn(`Ignoring unknown artifact: ${word + ' ' + bag.until(['\n', 'undefined'], true)}`);
                break;
        }
    }

    if (options.location) {
        return {
            tokens: bag.tokens,
            comments: options?.comments ? bag.comments : undefined,
        };
    } else {
        return {
            tokens: bag.tokens.map((o) => {
                return o.value;
            }),
            comments: options.comments
                ? bag.comments.map((o) => {
                      return o.value;
                  })
                : undefined,
        };
    }
};
