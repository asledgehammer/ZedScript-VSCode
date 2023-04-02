import { ScopeProperty } from '../Scope';
import { ScopeProperties } from '../ScopeProperties';

export class Weapon implements ScopeProperties {
    properties: { [name: string]: ScopeProperty } = {
        AimingPerkCritModifier: {
            type: 'int',
            description: `
                Parameter for weapons. A modifier that determines how much the Aim skill affects critical hits.
            `,
            example: 'AimingPerkCritModifier = 12,',
        },
        AimingPerkHitChanceModifier: {
            type: 'int',
            description: `
                Parameter for weapons. A modifier that determines how much the Aim skill affects the chance to hit the
                target.
            `,
            example: 'AimingPerkHitChanceModifier = 5,',
        },
        AimingPerkMinAngleModifier: {
            type: 'float',
            description: `
                Parameter for weapons. A modifier that determines how much the Aim skill affects the aiming angle.
            `,
            example: 'AimingPerkMinAngleModifier = 0.05,',
        },
        AimingPerkRangeModifier: {
            type: 'float',
            description: `
            Parameter for weapons. A modifier that determines how much the Aim skill affects the maximum firing range.
            `,
            example: 'AimingPerkRangeModifier = 1.5,',
        },
        AimingTime: {
            type: 'int',
            description: 'Time required to aim.',
            example: 'AimingTime = 20,',
        },
        AlwaysKnockdown: {
            type: 'boolean',
            description: 'If the parameter is true, then each hit will be a critical hit.',
            example: 'AlwaysKnockdown = true,',
        },
        AmmoBox: {
            type: 'string',
            description: 'Parameter for weapons. Indicates what type of ammo box the weapon uses.',
            example: 'AmmoBox = 308Box,',
        },
        AmmoType: {
            type: 'string',
            description: 'Parameter for firearms. Specifies the ammo type.',
            example: 'AmmoType = Base.ShotgunShells,',
        },
        AttachmentType: {
            type: 'string',
            description: `
                Specifies the type of place, where will be attached item.
                
                All attachments you can find in:
                "media/lua/client/Hotbar/ISHotbarAttachDefinition.lua"
            `,
            example: 'AttachmentType = Rifle,',
        },
        BaseSpeed: {
            type: 'float',
            description: 'Used for weapons. Affects weapon attack speed.',
            example: 'BaseSpeed = 0.93,',
        },
        BreakSound: {
            type: 'string',
            description: 'Specifies the sound that will play when the item breaks.',
            example: 'BreakSound = HammerBreak,',
        },
        BringToBearSound: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the sound that will be played when aiming starts.
            `,
            example: 'BringToBearSound = M1911BringToBear,',
        },
        CanBePlaced: {
            type: 'boolean',
            description: 'If the parameter is true, then the trap can be placed on the ground.',
            example: 'CanBePlaced = true,',
        },
        CanBeRemote: {
            type: 'boolean',
            description: 'Specifies that the trap is controlled remotely.',
            example: 'CanBeRemote = true,',
        },
        CanBeReused: {
            type: 'boolean',
            description: `
                Determines if the trap can be picked up and used again. Does not work with sensory traps.
            `,
            example: 'CanBeReused = true,',
        },
        CantAttackWithLowestEndurance: {
            type: 'boolean',
            description: `
                If this parameter is set to true, then the player will not be able to attack with this item if endurance
                is very low.
            `,
            example: 'CantAttackWithLowestEndurance = true,',
        },
        Categories: {
            type: 'enum',
            values: ['Axe', 'Spear', 'SmallBlade', 'LongBlade', 'Blunt', 'SmallBlunt'],
            description: 'Specifies the category for the game to correctly recognize the skill for this weapon.',
            example: 'Categories = SmallBlade,',
        },
        ClickSound: {
            type: 'string',
            description: 'The parameter specifies the sound that will be played when the trigger is pressed.',
            example: 'ClickSound = M9Jam,',
        },
        ClipSize: {
            type: 'int',
            description: 'Firearm magazine capacity.',
            example: 'ClipSize = 6,',
        },
        CloseKillMove: {
            type: 'string',
            description: 'Sets the kill animation up close.',
            example: 'CloseKillMove = Jaw_Stab,',
        },
        ConditionLowerChanceOneIn: {
            type: 'int',
            description: `This parameter specifies the item's breakage modifier when item used.`,
            example: 'ConditionLowerChanceOneIn = 25,',
        },
        ConditionMax: {
            type: 'int',
            description: 'Sets maximum durability.',
            example: 'ConditionMax = 10,',
        },
        Count: {
            type: 'int',
            description: `Determines how many items of this type will appear when spawning/crafting this type of item.`,
            example: 'Count = 5,',
        },
        CountDownSound: {
            type: 'string',
            description: 'The sound that will be played while the trap is running before the explosion.',
            example: 'CountDownSound = ticking,',
        },
        CritDmgMultiplier: {
            type: 'float',
            description: `
                Used for weapons. Indicates a modifier to a critical hit that is used in calculating the damage of a
                critical hit.
            `,
            example: 'CritDmgMultiplier = 1.7,',
        },
        CriticalChance: {
            type: 'int',
            description: `
                Used for weapons. Specifies the critical strike modifier that is used in the calculation of the chance
                of a critical strike.
            `,
            example: 'CriticalChance = 20,',
        },
        DamageCategory: {
            type: 'string',
            description: `
                Parameter for weapons. Specifies what type of damage will be displayed on the enemy that we hit with
                this weapon.
            `,
            example: 'DamageCategory = Slash,',
        },
        DamageMakeHole: {
            type: 'boolean',
            description: `
                Parameter for weapons. Determines if the weapon will inflict damage to clothing, which will leave a
                hole.
            `,
            example: 'DamageMakeHole = true,',
        },
        DoorDamage: {
            type: 'int',
            description: `
                Parameter for weapons. A modifier that affects how much damage is dealt to a door/vehicle with a given
                weapon.
            `,
            example: 'DoorDamage = 9,',
        },
        DoorHitSound: {
            type: 'string',
            description: 'Used for weapons. Indicates the sound when hitting a door.',
            example: 'DoorHitSound = HammerHit,',
        },
        EjectAmmoSound: {
            type: 'string',
            description: `
                Parameter for weapons. This parameter specifies the sound that will be played when the weapon is
                unloaded.
            `,
            example: 'EjectAmmoSound = DoubleBarrelShotgunEjectAmmo,',
        },
        EjectAmmoStartSound: {
            type: 'string',
            description: `
                Parameter for weapons. This parameter specifies the sound that will be played when the weapon starts to
                unload.
            `,
            example: 'EjectAmmoStartSound = DoubleBarrelShotgunEjectAmmoStart,',
        },
        EjectAmmoStopSound: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the sound that will be played when the weapon is
                unloaded.
            `,
            example: 'EjectAmmoStopSound = DoubleBarrelShotgunEjectAmmoStop,',
        },
        EnduranceMod: {
            type: 'float',
            description: 'A modifier that affects how endurance is spent during an attack.',
            example: 'EnduranceMod = 1.4,',
        },
        EquipSound: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the sound that will be played when the weapon is
                equipped.
            `,
            example: 'EquipSound = M14Equip,',
        },
        EquippedNoSprint: {
            type: 'boolean',
            description: `
                If this parameter is set to true, then the player will not be able to run fast when this item is
                equipped.
            `,
            example: 'EquippedNoSprint = true,',
        },
        ExplosionPower: {
            type: 'int',
            description: `The item's explosion strength modifier.`,
            example: 'ExplosionPower = 70,',
        },
        ExplosionRange: {
            type: 'int',
            description: 'Explosion radius.',
            example: 'ExplosionRange = 6,',
        },
        ExplosionSound: {
            type: 'string',
            description: 'The sound that will be played when the object explodes.',
            example: 'ExplosionSound = FlameTrapExplode,',
        },
        ExplosionTimer: {
            type: 'int',
            description: 'The time before the trap explodes.',
            example: 'ExplosionTimer = 5,',
        },
        ExtraDamage: {
            type: 'float',
            description: 'The additional damage dealt by a thrown item hit.',
            example: 'ExtraDamage = 0.001,',
        },
        FireMode: {
            type: 'enum',
            values: ['Auto', 'Single'],
            description: 'Parameter for weapons. Specifies which firing mode the weapon has. (Auto or Single)',
            example: 'FireMode = Auto,',
        },
        FireModePossibilities: {
            type: 'enum',
            values: ['Auto', 'Single', 'Auto/Single'],
            description: 'Sets the possible weapon firing modes that can be switched between.',
            example: 'FireModePossibilities = Auto/Single,',
        },
        FirePower: {
            type: 'int',
            description: 'Modifier for the strength of the fire that will appear after the explosion.',
            example: 'FirePower = 97,',
        },
        FireRange: {
            type: 'int',
            description: 'Fire spread radius.',
            example: 'FireRange = 6,',
        },
        HaveChamber: {
            type: 'boolean',
            description: 'Parameter for weapons. Indicates if the weapon has a chamber for bullet.',
            example: 'HaveChamber = false,',
        },
        HitAngleMod: {
            type: 'int',
            description: `
                A parameter that affects the attack sector (how many targets will be captured in one hit). The default
                value is zero. The smaller, the larger the range.
            `,
            example: 'HitAngleMod = -30,',
        },
        HitChance: {
            type: 'int',
            description: 'Modifier for firearms. Affects the chance to hit the target.',
            example: 'HitChance = 20,',
        },
        HitFloorSound: {
            type: 'string',
            description: 'Used for weapons. Indicates the sound that will be played when the item hits the floor.',
            example: 'HitFloorSound = AxeHit,',
        },
        HitSound: {
            type: 'string',
            description: `
                Used for weapons. Indicates the sound that will be played when the item hits. You can set the value to
                'null'. (To remove the sound)
            `,
            example: 'HitSound = BaseballBatHit,',
        },
        IdleAnim: {
            type: 'string',
            description: 'The parameter sets the idle animation with the weapon.',
            example: 'IdleAnim = Idle_Weapon2,',
        },
        InsertAllBulletsReload: {
            type: 'boolean',
            description: `
                Parameter for weapons. If the parameter is true, then the player loads ammo directly into the weapon.
            `,
            example: 'InsertAllBulletsReload = true,',
        },
        InsertAmmoSound: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the sound that will be played during reloading.
            `,
            example: 'InsertAmmoSound = DoubleBarrelShotgunInsertAmmo,',
        },
        InsertAmmoStartSound: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the sound that will be played when the reload starts.
            `,
            example: 'InsertAmmoStartSound = DoubleBarrelShotgunInsertAmmoStart,',
        },
        InsertAmmoStopSound: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the sound that will be played at the end of reloading.
            `,
            example: 'InsertAmmoStopSound = DoubleBarrelShotgunInsertAmmoStop,',
        },
        IsAimedFirearm: {
            type: 'boolean',
            description: 'The parameter specifies that the item is a firearm.',
            example: 'IsAimedFirearm = true,',
        },
        JamGunChance: {
            type: 'int',
            description: 'Parameter for weapons. Chance for gun jam.',
            example: 'JamGunChance = 2,',
        },
        KnockBackOnNoDeath: {
            type: 'boolean',
            description: `
                If the parameter is set to true, then when hit with this weapon, the player will receive a small amount
                of experience in the strength skill.
            `,
            example: 'KnockBackOnNoDeath = true,',
        },
        MagazineType: {
            type: 'string',
            description: 'Parameter for weapons. The parameter specifies the magazine type for the weapon.',
            example: 'MagazineType = Base.9mmClip,',
        },
        ManuallyRemoveSpentRounds: {
            type: 'boolean',
            description: `
                Parameter for weapons. If the parameter is true, then the shells will not fall to the ground after being
                fired.
            `,
            example: 'ManuallyRemoveSpentRounds = true,',
        },
        MaxAmmo: {
            type: 'int',
            description: 'Parameter for weapons. Determines the number of ammo that can fit in the item.',
            example: 'MaxAmmo = 15,',
        },
        MaxDamage: {
            type: 'float',
            description: 'Used for weapons. Sets the maximum damage factor, which affects the resulting damage.',
            example: 'MaxDamage = 1.5,',
        },
        MaxHitCount: {
            type: 'int',
            description: `
                The parameter determines the maximum number of targets that a player can hit with this weapon in one
                hit.
            `,
            example: 'MaxHitCount = 2,',
        },
        MaxRange: {
            type: 'float',
            description: `
                Used for weapons. Sets the weapon's maximum attack range. Range affects the chance of hitting a target.
            `,
            example: 'MaxRange = 1.55,',
        },
        MetalValue: {
            type: 'int',
            description: 'Sets the amount of metal in the item. Affects the operation of the microwave.',
            example: 'MetalValue = 150,',
        },
        MinAngle: {
            type: 'float',
            description: `
                Used for weapons. Determines the minimum aiming angle at which there will be enemies that can be hit.
                The larger the angle, the smaller the sector of hitting targets (selects the target more accurately). 
                
                Example:
                - Axe = 0.72
                - AssaultRifle = 0.965
            `,
            example: 'MinAngle = 0.75,',
        },
        MinDamage: {
            type: 'float',
            description: 'Parameter for weapons. Sets the minimum damage factor, which affects the resulting damage.',
            example: 'MinDamage = 0.1,',
        },
        MinimumSwingTime: {
            type: 'int',
            deprecated: true
        },
        MinRange: {
            type: 'float',
            description: `
                Used for weapons. Sets the minimum attack range of the weapon. Range affects the chance of hitting a
                target.
            `,
            example: 'MinRange = 0.61,',
        },
        ModelWeaponPart: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the weapon attachment. 
                
                Format: partType modelName attachmentNameSelf attachmentParent
            `,
            example: 'ModelWeaponPart = x8Scope x8Scope scope scope,',
        },
        MultipleHitConditionAffected: {
            type: 'boolean',
            description: `
                Parameter for weapons. If the parameter is set to true, then when a weapon hits targets, the durability
                of the weapon is spent. Usually set to false for firearms.
            `,
            example: 'MultipleHitConditionAffected = false,',
        },
        NoiseDuration: {
            type: 'int',
            description: 'The duration of the sound after the sound trap is triggered.',
            example: 'NoiseDuration = 30,',
        },
        NoiseRange: {
            type: 'int',
            description: 'Radius of sound propagation after the explosion of an item.',
            example: 'NoiseRange = 17,',
        },
        OtherHandRequire: {
            type: 'string',
            description: `
                Parameter for weapons. A parameter that determines the required item in the extra hand to use the
                original item.
            `,
            example: 'OtherHandRequire = Lighter,',
        },
        OtherHandUse: {
            type: 'boolean',
            description: `
                Used for weapons. If the parameter is true, then the item in the extra hand will be used.
                
                (Example: Molotov cocktail and lighter)
            `,
            example: 'OtherHandUse = true,',
        },
        PhysicsObject: {
            type: 'string',
            description: `
                If the parameter is true, then the player will throw the given item. The icon specified in this
                parameter will be used.
            `,
            example: 'PhysicsObject = sMolotov,',
        },
        PiercingBullets: {
            type: 'boolean',
            description: `
                If this parameter is set to true, then the bullets will be able to pass through the target and hit
                another target behind.
            `,
            example: 'PiercingBullets = true,',
        },
        PlacedSprite: {
            type: 'string',
            description: 'The sprite that will be used for the trap after it is set.',
            example: 'PlacedSprite = constructedobjects_01_32,',
        },
        PrimaryAnimMask: {
            type: 'string',
            description: `
                Specifies the animation mask that will be applied to the animation when the item is in the main hand.
            `,
            example: 'PrimaryAnimMask = HoldingTorchRight,',
        },
        PushBackMod: {
            type: 'float',
            description: 'The parameter determines the modifier that affects the stagger of targets after being hit.',
            example: 'PushBackMod = 0.3,',
        },
        RackAfterShoot: {
            type: 'boolean',
            description: `
                Parameter for weapons. If the parameter is true, then after the shot the player will reload the weapon.
            `,
            example: 'RackAfterShoot = true,',
        },
        RackSound: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the sound that will be played when rack the gun.
            `,
            example: 'RackSound = DesertEagleRack,',
        },
        Ranged: {
            type: 'boolean',
            description: 'Used for weapons. If the parameter is true, then the weapon is considered a firearm.',
            example: 'Ranged = true,',
        },
        RecoilDelay: {
            type: 'int',
            description: 'Specifies the delay between shots.',
            example: 'RecoilDelay = 20,',
        },
        ReloadTime: {
            type: 'int',
            description: 'Modifier of the time required to recharge.',
            example: 'ReloadTime = 25,',
        },
        RemoteRange: {
            type: 'int',
            description: 'The range at which the trap can be remotely activated.',
            example: 'RemoteRange = 11,',
        },
        RequiresEquippedBothHands: {
            type: 'boolean',
            description: 'If the parameter is true, then the item must be held in both hands to use it.',
            example: 'RequiresEquippedBothHands = true,',
        },
        RunAnim: {
            type: 'string',
            description: 'The parameter sets the animation of running with a weapon.',
            example: 'RunAnim = Run_Weapon2,',
        },
        SecondaryAnimMask: {
            type: 'string',
            description: `
               Specifies the animation mask that will be applied to the animation when the item is in the secondary
               hand.
            `,
            example: 'SecondaryAnimMask = HoldingTorchLeft,',
        },
        SensorRange: {
            type: 'int',
            description: 'The range at which the trap sensor is triggered.',
            example: 'SensorRange = 4,',
        },
        ShellFallSound: {
            type: 'string',
            description: 'Sets the sound of the dropped shell.',
            example: 'ShellFallSound = M9CartridgeFall,',
        },
        SmokeRange: {
            type: 'int',
            description: 'The radius of smoke spread after an item explodes.',
            example: 'SmokeRange = 5,',
        },
        SoundMap: {
            type: 'string',
            description: 'Specifies an EventName-Sound pair.',
            example: 'SoundMap = SpearStab SpearHuntingKnifeStab,',
        },
        SoundRadius: {
            type: 'int',
            description: 'Determines the radius of the sound that the item emits.',
            example: 'SoundRadius = 30,',
        },
        SoundVolume: {
            type: 'int',
            description: 'Parameter for firearms. Determines the volume of the shot.',
            example: 'SoundVolume = 50,',
        },
        SplatBloodOnNoDeath: {
            type: 'boolean',
            description: 'Parameter for weapons. Determines whether drops of blood will fall after hitting the target.',
            example: 'SplatBloodOnNoDeath = true,',
        },
        SplatNumber: {
            type: 'int',
            description: 'A modifier that affects the amount of blood that appears after being hit by an item.',
            example: 'SplatNumber = 4,',
        },
        StopPower: {
            type: 'int',
            description: 'Parameter for firearms. A modifier that affects the chance of a critical shot.',
            example: 'StopPower = 7,',
        },
        SubCategory: {
            type: 'string',
            deprecated: true
        },
        SwingAmountBeforeImpact: {
            type: 'float',
            deprecated: true
        },
        SwingAnim: {
            type: 'string',
            description: 'A value that is used to select the animation for swinging the weapon.',
            example: 'SwingAnim = Bat,',
        },
        SwingSound: {
            type: 'string',
            description: 'Parameter for weapons. Specifies the sound that is played when swinging a weapon.',
            example: 'SwingSound = GriddlePanSwing,',
        },
        SwingTime: {
            type: 'int',
            deprecated: true
        },
        TreeDamage: {
            type: 'int',
            description: 'Wood damage modifier.',
            example: 'TreeDamage = 5,',
        },
        TriggerExplosionTimer: {
            type: 'int',
            description: `
                The time after which the item will explode (after activation). Used for items that are thrown.
            `,
            example: 'TriggerExplosionTimer = 50,',
        },
        TwoHandWeapon: {
            type: 'boolean',
            description: 'If the parameter is true, then the weapon is considered two-handed.',
            example: 'TwoHandWeapon = true,',
        },
        UnequipSound: {
            type: 'string',
            description: `
                Parameter for weapons. The parameter specifies the sound that will be played when the weapon is
                unequiped.
            `,
            example: 'UnequipSound = M16UnEquip,',
        },
        UseEndurance: {
            type: 'boolean',
            description: 'If the parameter is false, then using the weapon will not waste endurance.',
            example: 'UseEndurance = false,',
        },
        UseSelf: {
            type: 'boolean',
            description: 'Used for weapons. If the parameter is true, then the weapon will be spent on use.',
            example: 'UseSelf = true,',
        },
        WeaponLength: {
            type: 'float',
            description: 'Parameter for melee weapons. A modifier that affects attack range.',
            example: 'WeaponLength = 0.23,',
        },
        WeaponReloadType: {
            type: 'string',
            description: `
                Parameter for weapons. Specifies the type of reload. The types of reloads are specified in the animation
                parameters. If you want to use the reload type from the original game - look at this option for a weapon
                of a similar type.
            `,
            example: 'WeaponReloadType = doublebarrelshotgun,',
        },
        WeaponSprite: {
            type: 'string',
            description: 'Specifies the name of model for the weapon.',
            example: 'WeaponSprite = HandAxe,',
        },
        Weight: {
            type: 'float',
            description: 'Sets the weight of the item.',
            example: 'Weight = 1.25,',
        },
    };
}
