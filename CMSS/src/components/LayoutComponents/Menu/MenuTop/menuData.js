export function getMenuData(decks, devices, cameras, callback){
    let menuData = [
        {
            title: 'VIEW OPTION',
            key: 'VIEW OPTION',
            url: '/documentation',
            icon: 'resources/images/icons/viewLayoutIcon.png',
            main: true,
            children: [
                {
                    title: 'LOAD CUSTOM',
                    key: 'loadCustom',
                    url: '/dashboard/alpha',
                    main: false,
                },
                {
                    title: 'SAVE CUSTOM',
                    key: 'saveCustom',
                    url: '/dashboard/beta',
                    main: false,
                },
            ],
        },
        {
            title: 'DECK SELECT',
            key: 'DECK SELECT',
            icon: 'resources/images/icons/deckViewIcon.png',
            main: true,
            children: [
                {
                    title: 'DECK 5',
                    key: 'deck5',
                    url: '/dashboard/alpha',
                    main: false,
                },
                {
                    title: 'DECK 4',
                    key: 'deck4',
                    url: '/dashboard/beta',
                    main: false,
                },
                {
                    title: 'DECK 3',
                    key: 'deck3',
                    url: '/dashboard/crypto',
                    main: false,
                },
                {
                    title: 'DECK 2',
                    key: 'deck2',
                    url: '/dashboard/beta',
                    main: false,
                },
                {
                    title: 'DECK 1',
                    key: 'deck1',
                    url: '/dashboard/crypto',
                    main: false,
                },
            ],
        },
        {
            title: 'SOUND',
            key: 'SOUND',
            icon: 'resources/images/icons/volumeIcon.png',
            main: true,
            children: [
                {
                    title: 'MUTE',
                    key: 'mute',
                    main: false,
                },
                {
                    title: 'UNMUTE',
                    key: 'unmute',
                    main: false,
                },
            ],
        },
        {
            title: 'CAMERAS',
            key: 'CAMERAS',
            icon: 'resources/images/icons/cameraIcon.png',
            main: true,
            children: [
                {
                    title: 'DECK 5',
                    key: 'deck5_camera',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4_deck5',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3_deck5',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2_deck5',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1_deck5',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
                {
                    title: 'DECK 4',
                    key: 'deck4_camera',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4_deck4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3_deck4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2_deck4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1_deck4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
                {
                    title: 'DECK 3',
                    key: 'deck3_camera',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4_deck3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3_deck3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2_deck3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1_deck3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
                {
                    title: 'DECK 2',
                    key: 'deck2_camera',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4_deck2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3_deck2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2_deck2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1_deck2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
                {
                    title: 'DECK 1',
                    key: 'deck1_camera',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4_deck1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3_deck1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2_deck1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1_deck1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
            ],
        },
        {
            title: 'CAM LIFTS',
            key: 'CAM LIFTS',
            icon: 'resources/images/icons/camLiftIcon.png',
            main: true,
            children: [
                {
                    title: 'ALL',
                    key: 'all',
                    main: false,
                    children: [
                        {
                            key: 'UP',
                            title: 'up',
                            url: '/pages/login-alpha',
                            main: false,
                        },
                        {
                            key: 'DOWN',
                            title: 'down',
                            url: '/pages/login-beta',
                            main: false,
                        },
                    ],
                },
                {
                    title: 'BY CAMERA',
                    key: 'byCamera',
                    main: false,
                    children: [
                        {
                            title: 'OBSERVATION DECK',
                            key: 'observationDeck',
                            main: false,
                            children: [
                                {
                                    key: 'UP',
                                    title: 'up',
                                    url: '/pages/login-alpha',
                                    main: false,
                                },
                                {
                                    key: 'DOWN',
                                    title: 'down',
                                    url: '/pages/login-beta',
                                    main: false,
                                },
                            ],

                        },
                        {
                            title: 'CAMERA 9',
                            key: 'camera9',
                            main: false,
                            children: [
                                {
                                    key: 'UP',
                                    title: 'up',
                                    url: '/pages/login-alpha',
                                    main: false,
                                },
                                {
                                    key: 'DOWN',
                                    title: 'down',
                                    url: '/pages/login-beta',
                                    main: false,
                                },
                            ],

                        },
                    ],
                },
            ],
        },
        {
            title: 'CAMERA PLAYBACK',
            key: 'CAMERA PLAYBACK',
            icon: 'resources/images/icons/playbackIcon.png',
            main: true,
            children: [
                {
                    title: 'DECK 5',
                    key: 'deck5',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
                {
                    title: 'DECK 4',
                    key: 'deck4',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
                {
                    title: 'DECK 3',
                    key: 'deck3',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
                {
                    title: 'DECK 2',
                    key: 'deck2',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
                {
                    title: 'DECK 1',
                    key: 'deck1',
                    main: false,
                    children: [
                        {
                            title: 'CAMERA 4',
                            key: 'camera4',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 3',
                            key: 'camera3',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 2',
                            key: 'camera2',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                        {
                            title: 'CAMERA 1',
                            key: 'camera1',
                            icon: 'resources/images/icons/camera-ptz.png',
                            main: false
                        },
                    ]

                },
            ],
        },
        {
            title: 'ACCESS CONTROL',
            key: 'ACCESS CONTROL',
            icon: 'resources/images/icons/accessControlIcon.png',
            main: true,
            children: [
                {
                    title: 'Default Pages',
                    key: 'defaultPages',
                    main: false,
                },
                {
                    title: 'Charts',
                    key: 'charts',
                    main: false,
                },
            ],
        },
        {
            title: 'DECK SENSOR',
            key: 'DECK SENSOR',
            icon: 'resources/images/icons/deckSensorIcon.png',
            main: true,
            children: [
                {
                    title: 'ALL',
                    key: 'all',
                    main: false,
                },
                {
                    title: 'BY ZONE',
                    key: 'byZone',
                    main: false,
                },
            ],
        },
        {
            title: 'DRONE VIEW',
            key: 'DRONE VIEW',
            icon: 'resources/images/icons/droneIcon.png',
            main: true,
        },
        {
            title: 'EVENT LOG',
            key: 'EVENT LOG',
            icon: 'resources/images/icons/eventLogIcon.png',
            main: true,
        },
    ]

    return menuData;
}

