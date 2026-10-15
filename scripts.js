// 1. MAP SETUP
// set up Mapbox map (create a new instance of the class Map)
let map;
let userLocation;
const userEl = document.createElement('div');
userEl.classList.add('userMarker');

navigator.geolocation.getCurrentPosition((position) => {
    userLocation = [position.coords.longitude, position.coords.latitude];
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiaHVkaW5oIiwiYSI6ImNtdG8xdzVwMDBwZnkyenM3bHN3bTdodmIifQ.GclqCq-2pfrrZnPUlAJBxQ';

    map = new mapboxgl.Map({
        container: 'map', // For finding the div with id "map" to put our container in
        center: userLocation,
        style: 'mapbox://styles/hudinh/cmuxvgm50000t01rebrfa5m08',
        projection: 'globe',
        zoom: 13,
    });

    // map load using .on() method - registers an event listener -> Mapbox's equivalent of JS's addEventListener
    map.on('load', () => {
        // add user location marker
        new mapboxgl.Marker({ element: userEl })
                .setLngLat(userLocation)
                .addTo(map);
        
        // add source for all tree layers
        // only add once outside the addTreeLayer function since these layers share the same source
        // if adding source inside the addTreeLayer function, it'll be added every time the function is called
        // -> Mapbox would throw an error saying the source already exists
        map.addSource('all-trees', {
            type: 'vector',
            url: 'mapbox://hudinh.fg2zmjud1ls6',
        })

        // add tree layers (targeting all trees in NYC)
        addTreeLayer('all-trees-part-1', '2f9faca31ed0f0274494');
        addTreeLayer('all-trees-part-2', 'c27509e74ddb6b78287e');
    })
})


// 2. TREE DATA
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


// 3. HELPER FUNCTIONS
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

function showNotes(tree) {
    const speciesName = tree.properties.GenusSpecies.split(' - ')[0].trim();
    const notes = {
        'Betula lenta': `
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
        'Betula populifolia': `
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
        'Carpinus caroliniana': `
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
    treeContent.innerHTML = notes[speciesName];
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

function titleCase(name) {
    return name.split(' ')
               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
               .join(' ');
}

function createCloseBtn(modal) {
    const closeBtn = document.createElement('div');
    closeBtn.textContent = '×';
    closeBtn.classList.add('closeBtn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
        if (modal === treeModal) {
            treeContent.classList.remove('notes');
        }
    });
    modal.prepend(closeBtn);
    return closeBtn;
}

function showMessage(text) {
    messageText.innerHTML = text;
    message.classList.add('visible');
}

function showCompletionScreen() {
    showMessage('Walk complete! You have observed all trees.');
}


// 4. MAIN FUNCTIONS
// define global variables needed for findTrees() and advanceStop() functions
let currentStopIndex = 0;
let selectedTrees = [];
let walkCompleted = false;

function findTrees() {
    selectedTrees = []; // clear selectedTrees from previous sessions
    currentStopIndex = 0; // reset currentStopIndex to correctly advance marker states
    walkCompleted = false; // reset walk status
    
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
        showMessage(`No nearby specimens found for ${missingSpecies.join(', ')}. Skipping to available trees.`)
    }

    if (selectedTrees.length === 0) {
        showMessage(`No trees in this family were found within walking range.`);
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
            showMessage('Could not generate a route. Please try again.');
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

        // clear existing stop markers first
        if (window.stopMarkers) {
            window.stopMarkers.forEach(m => m.remove());
        }
        window.stopMarkers = [];

        selectedTrees.forEach((tree, index) => {
            const speciesName = tree.properties.GenusSpecies.split(' - ')[0].trim();
            const el = document.createElement('div');
            el.classList.add('stopMarker');

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

            marker.getElement().addEventListener('click', () => {  
                showTreeModal(tree, index);
            });
        })

        const bounds = stops.reduce((b, coord) => b.extend(coord),
            new mapboxgl.LngLatBounds(stops[0], stops[0]));
        map.fitBounds(bounds, { padding: 80 });
    }
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


// 5. MOSA INTERACTION UI
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
    createCloseBtn(familyModal);
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
    walkModal.classList.add('visible');
    createCloseBtn(walkModal);
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

function showTreeModal(tree, index) {
    const [scientificName, commonName] = tree.properties.GenusSpecies.split(' - ');
    const formattedCommonName = titleCase(commonName);

    treeModalHeading.innerHTML = `${formattedCommonName}
                                  <br> (${scientificName})`;
    treeContent.innerHTML = `<audio controls>
                                <source src="./audio/audio-${scientificName}.mp3" type="audio/mpeg">
                            </audio>
                            <div class="clue-images">
                                <img src="./images/clue-${scientificName}_01.jpg" alt="Clue 1 Illustration"/>
                                <img src="./images/clue-${scientificName}_02.jpg" alt="Clue 2 Illustration"/>
                            </div>
                            `;
    
    const finishBtn = document.createElement('button');
    finishBtn.classList.add('button');
    finishBtn.textContent = 'Finish observing';
    
    const compareBtn = document.createElement('button');
    compareBtn.classList.add('button');
    compareBtn.textContent = 'Compare notes';

    if (window.stopMarkers[index].getElement().classList.contains('visited')) {
        treeContent.appendChild(compareBtn);
    } else {
        treeContent.appendChild(finishBtn);  
    }

    finishBtn.addEventListener('click', () => {
        advanceStop();
        treeContent.removeChild(finishBtn);
        treeContent.appendChild(compareBtn);
    });

    compareBtn.addEventListener('click', () => {
        treeContent.classList.add('notes');
        showNotes(tree);

        // check if walk is complete
        if (currentStopIndex >= window.stopMarkers.length && !walkCompleted) {
            showCompletionScreen();
            walkCompleted = true;
        }

        console.log(currentStopIndex);
    });

    treeModal.classList.add('visible');
    createCloseBtn(treeModal);
}

// create message card 
const message = document.createElement('div');
message.classList.add('message');

const messageText = document.createElement('div');
messageText.classList.add('messageText');
message.appendChild(messageText);

const messageCloseBtn = createCloseBtn(message);
messageCloseBtn.classList.add('messageClose');
document.body.appendChild(message);