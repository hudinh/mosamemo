// 1. MAP SETUP
// set up Mapbox map (create a new instance of the class Map)
mapboxgl.accessToken = 'pk.eyJ1IjoiaHVkaW5oIiwiYSI6ImNtdG8xdzVwMDBwZnkyenM3bHN3bTdodmIifQ.GclqCq-2pfrrZnPUlAJBxQ';

const map = new mapboxgl.Map({
    container: 'map', // For finding the div with id "map" to put our container in
    center: [-73.947438,40.788416], // >> later on change this to user's location
    style: 'mapbox://styles/hudinh/cmuxvgm50000t01rebrfa5m08',
    projection: 'globe',
    zoom: 13,
});


// 2. CONTROLS
// create a new geolocate instance and store it in geolocate
// refer to GeolocateControl here: https://docs.mapbox.com/mapbox-gl-js/api/markers/
const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true, // if true the GeolocateControl becomes a toggle button, 
    // and when on the user's location is actively monitored for changes
    showUserHeading: true
});

map.addControl(geolocate);

// add directions interface to map 
// refer to tutorial here: https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/ 
const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken, 
        unit: 'metric',
        profile: 'mapbox/walking',
        interactive: false,
        controls: {
            inputs: true,
            instructions: true
        }
    });

map.addControl(directions, 'top-right');


// 3. STATES
// create object to store tree states
const treeState = {
    '01': 'unvisited', 
    '02': 'unvisited',
    '03': 'unvisited'
}; 

// create object to store tree data
const treeData = {
    '01': { commonName: 'Sweet Birch', scientificName: 'Betula lenta' },
    '02': { commonName: 'Gray Birch', scientificName: 'Betula populifolia' },
    '03': { commonName: 'American Hornbeam', scientificName: 'Carpinus caroliniana' }
};

// create variable to store current popup
let currentPopup = null;

// 4. HELPER FUNCTIONS
// function to generate and return the popup HTML string
function getPopupHTML(treeId) {
    const treeCommonName = treeData[treeId].commonName;
    const treeScientificName = treeData[treeId].scientificName;
    const state = treeState[treeId]

    if (state === 'visited') {
        return `
            <div class="popup-card">
                <h3>${treeCommonName}</h3>
                <h3><em>${treeScientificName}</em></h3>
                <div class="clue-images">
                    <img src="./images/clue-${treeId}_01.jpg" alt="Clue 1 Illustration"/>
                    <img src="./images/clue-${treeId}_02.jpg" alt="Clue 2 Illustration"/>
                </div>
                <audio controls>
                    <source src="./audio/audio-${treeId}.mp3" type="audio/mpeg">
                </audio>
                <button class="compare-btn">
                    Compare Notes
                </button>
            </div>
        `;
        } else {
            return `
                <div class="popup-card">
                    <h3>${treeCommonName}</h3>
                    <h3><em>${treeScientificName}</em></h3>
                    <div class="clue-images">
                        <img src="./images/clue-${treeId}_01.jpg" alt="Clue 1 Illustration"/>
                        <img src="./images/clue-${treeId}_02.jpg" alt="Clue 2 Illustration"/>
                    </div>
                    <audio controls>
                        <source src="./audio/audio-${treeId}.mp3" type="audio/mpeg">
                    </audio>
                    <button class="target-btn">
                        Take me there
                    </button>
                    <button class="visited-btn">
                        Finish observing
                    </button>
                </div>
            `
        }
    }

// function to attach event listeners to popup buttons - called whenever popup HTML is set or updated
function attachPopupListeners(treeId) {
    const compareBtn = document.querySelector('.compare-btn');
    const targetBtn = document.querySelector('.target-btn');
    const visitedBtn = document.querySelector('.visited-btn');

    // if (btn) checks on each button in case it's null and null.addEventListener would throw an error
    if (compareBtn) {
        compareBtn.addEventListener('click', () => showCompareNotes(treeId));
    }
    if (targetBtn) {
        targetBtn.addEventListener('click', () => updateTreeState(treeId, 'target'));
    }
    if (visitedBtn) {
        visitedBtn.addEventListener('click', () => updateTreeState(treeId, 'visited'));
    }
}
    
// function that updates the popup to show botanical notes
// called by the compare button listener
function showCompareNotes(treeId) {
    const notes = {
        '01': `
            <h4>Sweet Birch Notes</h4>
            <p><strong>Habit:</strong> Oval, Pyramidal</p>
            <p><strong>Size:</strong> Medium-sized tree, 40'-50'</p>
            <p><strong>Bark:</strong> 
                <ul>
                    <li>Reddish brown with horizontal lenticels on young trees.</li>
                    <li>Bark on older trunk is gray to blackish and cracks into scaly plates.</li> 
                    <li>Twigs are reddish brown with small white lenticels.</li>
                </ul>
            </p>
            <p><strong>Leaf:</strong> 
                <ul>
                    <li>Shape: Ovate to elliptical</li>
                    <li>Division: Simple</li>
                    <li>Arrangement: Alternate</li>
                    <li>Margin: Serrate</li>
                    <li>Texture/Venation: Clearly impressed parallel veins</li>
                    <li>Size: 2"-4" long</li>
                </ul>
            </p>
        `,
        '02': `
            <h4>Gray Birch Notes</h4>
            <p><strong>Habit:</strong> Oval with an open and airy canopy that easily 
                flutters like the poplar tree</p>
            <p><strong>Size:</strong> Small-medium tree, 20'-40'</p>
            <p><strong>Bark:</strong>
                <ul>
                    <li>Grayish white bark, darker gray on old trees</li>
                    <li>Smooth, no peeling (unlike Paper Birch)</li>
                    <li>Black trianglar patches where branch meets trunk</li>
                </ul>
            </p>
            <p><strong>Leaf:</strong>
                <ul>
                    <li>Color: Dark green above, pale below</li>
                    <li>Shape: Broadly triangular, ovate-deltoid with elongated and 
                        sharply pointed tip. Long and slender petiole allows leaf 
                        to flutter easily</li>
                    <li>Division: Simple</li>
                    <li>Arrangmenet: Alternate</li>
                    <li>Margin: Doubly serrate</li>
                    <li>Texture/Venation: shiny above, parallel veins</li>
                    <li>Size: 2"-3.5" long</li>
                </ul>
            </p>
        `,
        '03': `
            <h4>American Hornbeam Notes</h4>
            <p><strong>Habit:</strong> Round, flat-topped</p>
            <p><strong>Size:</strong> Small-medium tree, 20'-35'</p>
            <p><strong>Bark:</strong>
                <ul>
                    <li>Smooth, light to medium gray</li>
                    <li>Fluted, sinewy trunk that looks like muscles</li>
                    <li>Stem is slender, smooth, dark red-brown and are dotted with 
                        tan lenticels</li>
                </ul>
            </p>
            <p><strong>Leaf:</strong>
                <ul>
                    <li>Shape: Ovate, elliptical</li>
                    <li>Division: Simple</li>
                    <li>Arrangmenet: Alternate</li>
                    <li>Margin: Serrate</li>
                    <li>Texture/Venation: Prominent parallel veins giving a 
                        corrugated texture</li>
                    <li>Size: 2"-5.5" long</li>
                </ul>
            </p>
        `
    };

    if (currentPopup) {
        currentPopup.setHTML(`
            <div class="popup-card">
                <h3>Compare Notes</h3>
                ${notes[treeId]}
            </div>
        `);

        // whenever setHTML is called, it replaces the DOM and wipes out any previously attached listeners
        // -> call attachPopupListeners immediately after setHTML
        attachPopupListeners(treeId); 
    }
}

// function to add tree data layers
function addTreeLayer(layerId, sourceLayer) {
    map.addLayer({
        'id': layerId,
        'type': 'circle',
        'source': 'all-trees',
        'source-layer': sourceLayer,
        'minzoom': 12,
        'paint': {
            'circle-color': '#1b25f2',
            'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                12, 0.05,
                14, 0.1,
                16, 0.4,
            ],
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                12, 1,
                14, 4,
                16, 7,
            ],
        }
    }, 'road-label'); // insert BEFORE this layer so labels appear on top
}


// 5. MAIN FUNCTIONS
// create function to update tree state based on user interactions
function updateTreeState (treeId, newState) {
    treeState[treeId] = newState;

    // if this tree is now the target, set it as the destination in directions
    if (newState === 'target') {
        // retrieve tree coordinates from source features
        // querySourceFeatures is a Mapbox-specific method on the map instance
        // read more about it here: https://docs.mapbox.com/mapbox-gl-js/api/map/#map#querysourcefeatures
        const features = map.querySourceFeatures('mapbox://hudinh.14wp2kyfcfk6', {
            sourceLayer: '68bb5b17bca5650c9abe',
            filter: ['==', 'Tree ID', treeId]
        });

        // (features.length > 0) -> defensive programming for cases where the query returns zero results
        if (features.length > 0) {
            const coords = features[0].geometry.coordinates;
            directions.setDestination(coords);
        }
    }

    // keep popup content in sync with tree state if popup's open 
    // so that users don't have to close and open popup again 
    // (eg: after users click 'Finish Observing' to reveal 'Compare Notes' button)
    // setHTML replaces the popup's current HTML content with the new string
    // getPopupHTML - custom function to generate new HTML string based on the current state
    if (currentPopup && currentPopup.isOpen()) {
        currentPopup.setHTML(getPopupHTML(treeId));
    }
    
    // attach popup listeners after setHTML is called
    attachPopupListeners(treeId);

    // update icon colors based on new state
    // setLayoutProperty syntax: map.setLayoutProperty(layerId, name, value)
    map.setLayoutProperty('tree-location-icons', 'icon-image', [
        'image',
            'Tree Location Marker',
            {
                'params': {
                    'color-1': '#f2f2e9',
                    'color-2': [
                        'match', // operator - like a switch statement
                        ['get', 'Tree ID'], // input - get the Tree ID property from each feature
                        '01', treeState['01'] === 'target' ? '#1b25f2' :
                                treeState['01'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                        '02', treeState['02'] === 'target' ? '#1b25f2' :
                                treeState['02'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                        '03', treeState['03'] === 'target' ? '#1b25f2' :
                                treeState['03'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                        '#a7a8a9'                              
                    ]
                }
            }
    ]);

    map.setLayoutProperty('tree-icons', 'icon-image', [
        'image', 
            ['match', ['get', 'Tree ID'],
                '01', treeState['01'] === 'target' || 
                        treeState['01'] === 'visited' ? 
                        'Sweet Birch' : 'Number 1',
                '02', treeState['02'] === 'target' || 
                        treeState['02'] === 'visited' ? 
                        'Gray Birch' : 'Number 2',
                '03', treeState['03'] === 'target' || 
                        treeState['03'] === 'visited' ? 
                        'American Hornbeam' : 'Number 3',
                'Question Mark'
            ],
            {
                'params': {
                    'color-1': '#f2f2e9',
                    'color-2':  [
                        'match', ['get', 'Tree ID'], 
                        '01', treeState['01'] === 'target' ? '#1b25f2' :
                                treeState['01'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                        '02', treeState['02'] === 'target' ? '#1b25f2' :
                                treeState['02'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                        '03', treeState['03'] === 'target' ? '#1b25f2' :
                                treeState['03'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                        '#a7a8a9'
                    ]
                }
            }
    ]);
};

/*
after testing, use the following code to get user's location: 
navigator.geolocation.getCurrentPosition((position) => {
    const userLocation = [position.coords.longitude, position.coords.latitude];
    // rest of search logic here
})
*/

// define global variables needed for findTrees() and advanceStop() functions
let currentStopIndex = 0;
let selectedTrees = [];

function findTrees() {
    const userLocation = [-73.947438,40.788416];
    selectedTrees = []; // clear selectedTrees from previous sessions
    
    // get the species that belong to the selected family
    const familySpecies = {
        'Betulaceae': ['Betula lenta', 'Betula populifolia', 'Carpinus caroliniana'],
    };
    const targetSpecies = familySpecies[selectedFamily.scientific];
    
    // query all features from the tree layer
    const allTrees = [
        ...map.querySourceFeatures('all-trees', {
            sourceLayer: '2f9faca31ed0f0274494',
        }),
        ...map.querySourceFeatures('all-trees', {
            sourceLayer: 'c27509e74ddb6b78287e',
        }),
    ];

    // filter to species in selected family and within 1000m (1/2 mile or 10-min walking radius)
    const nearbyTrees = allTrees.filter(tree => {
        const treeCoords = tree.geometry.coordinates;
        const distance = getDistance(userLocation, treeCoords);
        const speciesName = tree.properties.GenusSpecies.split(' - ')[0].trim();
        return targetSpecies.includes(speciesName) && distance <= 1000;
    });

    // pick closest specimen per species, following list order
    const missingSpecies = [];

    for (const species of targetSpecies) {
        const specimens = nearbyTrees.filter(tree => 
            tree.properties.GenusSpecies.split(' - ')[0].trim() === species
        );
        
        console.log(specimens);
        if (specimens.length === 0) {
            missingSpecies.push(species);
            continue;
        }

        const closest = specimens.reduce((a,b) =>
            getDistance(userLocation, a.geometry.coordinates) <=
            getDistance(userLocation, b.geometry.coordinates) ? a : b
        );
        selectedTrees.push(closest);
    }

    // notify users about missing species
    if (missingSpecies.length > 0) {
        alert(`No nearby specimens found for ${missingSpecies.join(', ')}. Skipping to available trees.`);
    }

    if (selectedTrees.length === 0) {
        alert(`No trees in this family were found within walking range.`)
    }

    console.log('Selected trees:', selectedTrees);

    // close walk modal and generate route
    walkModal.classList.remove('visible');
    const stops = [userLocation, ...selectedTrees.map(t => t.geometry.coordinates)];
    generateRoute(stops);

    async function generateRoute(stops) {
        const coords = stops.map(([lng, lat]) => `${lng},${lat}`).join(';');
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
            alert ('Could not generate a route. Please try again.');
            return;
        }

        const routeGeometry = data.routes[0].geometry;

        // add or update route line on map
        if (map.getSource('route')) {
            map.getSource('route').setData(routeGeometry);
        } else {
            map.addSource('route', { type: 'geojson', data: routeGeometry });
            map.addLayer({
                id: 'route', 
                type: 'line',
                source: 'route',
                paint: {
                    'line-color': '#F23D3D',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        12, 3,
                        14, 7,
                        16, 9,
                    ],
                }
            });
        }

        // reset currentStopIndex to correctly advance marker states
        currentStopIndex = 0;

        // clear existing stop markers first
        if (window.stopMarkers) {
            window.stopMarkers.forEach(m => m.remove());
        }
        window.stopMarkers = [];

        selectedTrees.forEach((tree, index) => {
            const speciesName = tree.properties.GenusSpecies.split(' - ')[0].trim();
            const el = document.createElement('div');
            el.classList.add('stopMarker');

            const userEl = document.createElement('div');
            userEl.classList.add('userMarker');

            if (index === 0) {
                el.classList.add('active');
                el.innerHTML = `<img src="./images/${speciesName}.svg">`;
            } else {
                el.classList.add('upcoming');
                el.innerHTML = `<img src="./images/question-mark_red.svg">`;
            }

            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat(tree.geometry.coordinates)
                .addTo(map);

            window.stopMarkers.push(marker);

            new mapboxgl.Marker({ element: userEl })
                .setLngLat(userLocation)
                .addTo(map);

            marker.getElement().addEventListener('click', () => {  
                showTreeModal(tree);
            });
        })

        const bounds = stops.reduce((b, coord) => b.extend(coord),
            new mapboxgl.LngLatBounds(stops[0], stops[0]));
        map.fitBounds(bounds, { padding: 80 });
    }
}

// haversine formula — calculates distance in meters between two [lng, lat] points
function getDistance([lng1, lat1], [lng2, lat2]) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// function to advance between tree states
function advanceStop() {
    // mark current stop as visited
    const currentEl = window.stopMarkers[currentStopIndex].getElement();
    currentEl.classList.remove('active');
    currentEl.classList.add('visited');

    currentStopIndex++;

    // check if walk is complete
    if (currentStopIndex >= window.stopMarkers.length) {
        showCompletionScreen();
        return;
    }

    // activate next stop
    const nextEl = window.stopMarkers[currentStopIndex].getElement();
    nextEl.classList.remove('upcoming');
    nextEl.classList.add('active');

    // update icon from question mark to species icon
    const nextTree = selectedTrees[currentStopIndex];
    const speciesName = nextTree.properties.GenusSpecies.split(' - ')[0].trim();
    nextEl.innerHTML = `<img src="./images/${speciesName}.svg">`;
}

function showCompletionScreen() {
    alert('Walk complete! You have observed all trees.');
}


// 6. MAP LOAD
// .on() method - registers an event listener -> Mapbox's equivalent of JS's addEventListener
map.on('load', () => {
    // log sources and trees layer to help debug
    console.log('Sources:', map.getStyle().sources);
    console.log('Trees layer:', map.getStyle().layers.find(l => l.id === 'trees'));

    // create an event listener for the geolocate control
    // when users click geolocate, their location will be put in the origin of directions 
    geolocate.on('geolocate', (e) => {
        const lon = e.coords.longitude;
        const lat = e.coords.latitude;
        directions.setOrigin([lon, lat]);
    });

    // clear icon from the original 'trees' layer that was set up in Mapbox Studio
    map.setLayoutProperty('trees', 'icon-image', '');

    // Layer 1 — marker base (targeting layer with only 3 trees in the walk)
    map.addLayer({
        'id': 'tree-location-icons',
        'type': 'symbol',
        'source': 'mapbox://hudinh.14wp2kyfcfk6',
        'source-layer': '68bb5b17bca5650c9abe', 
        'layout': {
            'icon-image': [
                'image', 
                    'Tree Location Marker',
                    {
                        'params': {
                            'color-1': '#f2f2e9',
                            'color-2': '#a7a8a9'
                        }
                    }
            ],
            'icon-size': [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.1,
                14,
                0.25
                ],
            'icon-allow-overlap': true,
        }
    });

    // Layer 2 - tree icons (targeting layer with only 3 trees in the walk)
    map.addLayer({
        'id': 'tree-icons',
        'type': 'symbol',
        'source': 'mapbox://hudinh.14wp2kyfcfk6',
        'source-layer': '68bb5b17bca5650c9abe',
        'layout': {
            'icon-image': [
                'image',
                ['match', ['get', 'Tree ID'],
                    '01', 'Number 1',
                    '02', 'Number 2',
                    '03', 'Number 3',
                    'Question Mark',
                ],
                {
                    'params': {
                        'color-1': '#a7a8a9'
                    }
                }
            ],
            'icon-size': [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0.2,
                14,
                0.3
                ],
            'icon-allow-overlap': true,
            'icon-offset': [1,1]
        }, 
        'paint': {
            'icon-opacity': [
                "interpolate",
                ["linear"],
                ["zoom"],
                13, 0,
                14, 1
                ],
        }
    });

    // add source for all tree layers
    // only add once outside the addTreeLayer function since these layers share the same source
    // if adding source inside the addTreeLayer function, it'll be added every time the function is called
    // -> Mapbox would throw an error saying the source already exists
    map.addSource('all-trees', {
        type: 'vector',
        url: 'mapbox://hudinh.fg2zmjud1ls6',
    })

    // Layer 3 & 4 (targeting all trees in NYC)
    addTreeLayer('all-trees-part-1', '2f9faca31ed0f0274494');
    addTreeLayer('all-trees-part-2', 'c27509e74ddb6b78287e');

    // add click interaction for popups
    // addInteraction is similar to addEventListener
    // it listens for an event and then runs a callback function
    // it's designed specifically for map interactions as it understands Mapbox layers and features
    map.addInteraction('feature-click', {
        type: 'click', 
        target: { layerId: 'tree-location-icons' }, 
        // handler is a property whose value is a function
        // handler(e) is shorthand for handler: (e) => {}
        // e is the event object that Mapbox passes to the function automatically when the click happens
        // e is just a naming convention, not standard syntax -> can change this to event or anything
        handler(e) { 
            console.log('properties:', e.feature.properties);
            // get the clicked tree's properties
            const treeId = e.feature.properties['Tree ID'];
            const treeCommonName = e.feature.properties['Common Name'];
            const treeScientificName = e.feature.properties['Scientific Name']
            const coordinates = e.feature.geometry.coordinates.slice();

            if (currentPopup) {
                currentPopup.remove();
            }
            // create and show popup
            currentPopup = new mapboxgl.Popup({offset: 25, anchor: 'bottom'})
                .setLngLat(coordinates)
                .setHTML(getPopupHTML(treeId))
                .addTo(map);

            // attach popup listeners after setHTML is called
            attachPopupListeners(treeId);
        }
    });

    // Mouse enter cursor change
    map.addInteraction('enter-tree', {
        type: 'mouseenter',
        target: { layerId: 'tree-location-icons' }, 
        handler(e) {
            map.getCanvas().style.cursor = 'pointer'
        }
    });

    // Mouse leave cursor change
    map.addInteraction('leave-tree', {
        type: 'mouseleave',
        target: { layerId: 'tree-location-icons'},
        handler(e) {
            map.getCanvas().style.cursor = ''
        }
    })
})


// 7. MOSA INTERACTION UI
// create UI elements
const chatDisplay = document.querySelector('#chat-display');
const mosaAvartar = document.querySelector('#mosa-avatar');
const audioBubble = document.querySelector('#audio-bubble');
const nextBtn = document.querySelector('.next-btn');

const audio = document.createElement('audio');
audio.controls = true;
audioBubble.prepend(audio); // prepend audio before the button rather than replacing everything

// show 'Next' button when audio ends
audio.addEventListener('ended', () => {
    nextBtn.classList.add('visible');
});

// create advance logic
let currentStep = 1;

const steps = {
    1: { audio: './audio/audio-Betula populifolia.mp3'}, 
    2: { audio: './audio/audio-Carpinus caroliniana.mp3'}, 
    3: 'family-selection' // signal to show modal instead of audio
};

function updateStep() {
    const step = steps[currentStep];

    if (step === 'family-selection') {
        audioBubble.classList.add('hide');
        showFamilyModal();
    } else {
        // update audio source
        audio.src = step.audio;
        audio.load(); // reload with new source
        nextBtn.classList.remove('visible'); // hide 'Next' button while audio plays
    }
}

updateStep(); // call function to update audio source for currentStep = 1

// create 'Next' button click interaction to allow users to advance to next step  
nextBtn.addEventListener('click', () => {
    currentStep++;
    updateStep();
});

// create tree families modal
const treeFamilies = [
    { scientific: 'Altingiaceae',       common: 'Sweetgum Family' },
    { scientific: 'Anacardiaceae',      common: 'Cashew Family' },
    { scientific: 'Annonaceae',         common: 'Custard Apple Family' },
    { scientific: 'Aquifoliaceae',      common: 'Holly Family' },
    { scientific: 'Araliaceae',         common: 'Ginseng Family' },
    { scientific: 'Betulaceae',         common: 'Birch Family' },
    { scientific: 'Bignoniaceae',       common: 'Trumpet Creeper Family' },
    { scientific: 'Cannabaceae',        common: 'Hemp Family' },
    { scientific: 'Cercidiphyllaceae',  common: 'Katsura Family' },
    { scientific: 'Cornaceae',          common: 'Dogwood Family' },
    { scientific: 'Cupressaceae',       common: 'Cypress Family' },
    { scientific: 'Ebenaceae',          common: 'Ebony Family' },
    { scientific: 'Elaeagnaceae',       common: 'Oleaster Family' },
    { scientific: 'Ericaceae',          common: 'Heather Family' },
    { scientific: 'Eucommiaceae',       common: 'Hardy Rubber Tree Family' },
    { scientific: 'Fabaceae',           common: 'Legume Family' },
    { scientific: 'Fagaceae',           common: 'Beech and Oak Family' },
    { scientific: 'Ginkgoaceae',        common: 'Ginkgo Family' },
    { scientific: 'Hamamelidaceae',     common: 'Witch-hazel Family' },
    { scientific: 'Hydrangeaceae',      common: 'Hydrangea Family' },
    { scientific: 'Juglandaceae',       common: 'Walnut Family' },
    { scientific: 'Lamiaceae',          common: 'Mint Family' },
    { scientific: 'Lauraceae',          common: 'Laurel Family' },
    { scientific: 'Lythraceae',         common: 'Loosestrife Family' },
    { scientific: 'Magnoliaceae',       common: 'Magnolia Family' },
    { scientific: 'Malvaceae',          common: 'Mallow Family' },
    { scientific: 'Moraceae',           common: 'Mulberry Family' },
    { scientific: 'Myricaceae',         common: 'Bayberry Family' },
    { scientific: 'Nyssaceae',          common: 'Tupelo Family' },
    { scientific: 'Oleaceae',           common: 'Olive Family' },
    { scientific: 'Paulowniaceae',      common: 'Empress Tree Family' },
    { scientific: 'Pinaceae',           common: 'Pine Family' },
    { scientific: 'Platanaceae',        common: 'Plane Tree Family' },
    { scientific: 'Rosaceae',           common: 'Rose Family' },
    { scientific: 'Rutaceae',           common: 'Rue Family' },
    { scientific: 'Salicaceae',         common: 'Willow Family' },
    { scientific: 'Sapindaceae',        common: 'Soapberry Family' },
    { scientific: 'Simaroubaceae',      common: 'Quassia Family' },
    { scientific: 'Styracaceae',        common: 'Snowbell Family' },
    { scientific: 'Tamaricaceae',       common: 'Tamarisk Family' },
    { scientific: 'Taxaceae',           common: 'Yew Family' },
    { scientific: 'Theaceae',           common: 'Tea Family' },
    { scientific: 'Tiliaceae',          common: 'Linden Family' },
    { scientific: 'Thymelaeaceae',      common: 'Daphne Family' },
    { scientific: 'Ulmaceae',           common: 'Elm Family' },
];

const familyModal = document.createElement('div');
document.body.appendChild(familyModal); 
familyModal.classList.add('modal');    

const familyModalHeading = document.createElement('div');
familyModalHeading.textContent = 'Tree Families';
familyModal.appendChild(familyModalHeading);
familyModalHeading.classList.add('heading');

const profileCollection = document.createElement('div');
familyModal.appendChild(profileCollection);
profileCollection.classList.add('profileCollection');

const unlockedFamilies = new Set(['Betulaceae']);
let selectedFamily = undefined; 

for (const family of treeFamilies) {
    const profile = document.createElement('div');
    const isUnlocked = unlockedFamilies.has(family.scientific);

    profile.classList.add('profile');

    if (isUnlocked) {
        profile.classList.add('unlocked');
        profile.innerHTML = `<img src="./images/${family.scientific}.svg" alt="${family.common}">
                             <span>${family.common}</span>`;
        profile.addEventListener('click', () => {
            selectedFamily = family;
            familyModal.classList.remove('visible');
            showWalkModal();
        })
    } else {
        profile.classList.add('locked');
        profile.innerHTML = `<img src="./images/question-mark_blue.svg" alt="Locked family">`;
    }

    profileCollection.appendChild(profile);
}

function showFamilyModal() {
    familyModal.classList.add('visible');
}

//create walk modal
const walkModal = document.createElement('div');
document.body.appendChild(walkModal);
walkModal.classList.add('modal');

const walkModalHeading = document.createElement('div');
walkModalHeading.classList.add('heading');
walkModal.appendChild(walkModalHeading);

const walkContent = document.createElement('div');
walkContent.classList.add('modalContent');
walkContent.innerHTML = `<p>Below is a list of trees included in this walk. 
                        Tap “Find trees near me” to generate a walking route in your neighborhood! 
                        Once the route is generated, tap the first tree on the map and you will see 
                        a pop-up with clues for you to hunt for the tree and an audio guide. 
                        Follow the instructions of the audio guide and enjoy the walk!</p>
                        <ol>
                            <li>
                                <strong>Sweet Birch</strong>
                                <br><em>Betula lenta</em>
                            </li>
                            <li>
                                <strong>Gray Birch</strong>
                                <br><em>Betula populifolia</em>
                            </li>
                            <li><strong>American Hornbeam</strong>
                                <br><em>Carpinus caroliniana</em>
                            </li>
                        </ol>`
walkModal.appendChild(walkContent);

const findTreesBtn = document.createElement('button');
findTreesBtn.textContent = 'Find trees near me';
findTreesBtn.classList.add('button');
walkModal.appendChild(findTreesBtn);
findTreesBtn.addEventListener('click', () => {
    findTrees();
});

function showWalkModal() {
    walkModal.classList.add('visible')
    walkModalHeading.textContent = `${selectedFamily.common} (${selectedFamily.scientific}) Walk`;
}

// create tree modal
const treeModal = document.createElement('div');
treeModal.classList.add('modal');
document.body.appendChild(treeModal);

const treeModalHeading = document.createElement('div');
treeModalHeading.classList.add('heading');
treeModal.appendChild(treeModalHeading);

const treeContent = document.createElement('div');
treeContent.classList.add('modalContent');
treeModal.appendChild(treeContent);

function showTreeModal(tree) {
    const [scientificName, commonName] = tree.properties.GenusSpecies.split(' - ');

    treeModalHeading.innerHTML = `${commonName}
                                  <br> (${scientificName})`;
    treeContent.innerHTML = `<audio controls>
                                <source src="./audio/audio-${scientificName}.mp3" type="audio/mpeg">
                            </audio>
                            <div class="clue-images">
                                <img src="./images/clue-${scientificName}_01.jpg" alt="Clue 1 Illustration"/>
                                <img src="./images/clue-${scientificName}_02.jpg" alt="Clue 2 Illustration"/>
                            </div>
                            <button class="button" id="finish-btn">
                                Finish observing
                            </button>
                            `;
    
    document.getElementById('finish-btn').addEventListener('click', () => {
        treeModal.classList.remove('visible');
        advanceStop();
    });

    treeModal.classList.add('visible');
}

