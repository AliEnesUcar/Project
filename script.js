document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.getElementById('envelope-wrapper');

    // --- Configuration ---
    const totalImages = 45; // Total number of images in the folder
    const imageFolder = 'pictures/';
    const imageExtension = '.jpeg';
    const gridCols = 6;
    const gridRows = 4;
    const minInterval = 3000; // Minimum update time (ms)
    const maxInterval = 8000; // Maximum update time (ms)

    // --- Envelope Interaction ---
    envelopeWrapper.addEventListener('click', () => {
        envelopeWrapper.classList.toggle('open');
    });

    // --- Mosaic Logic ---
    const bgSlider = document.getElementById('bg-slider');

    // Generate Grid Cells
    const totalCells = gridCols * gridRows;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('mosaic-cell');

        // Create 2 layers for cross-fading
        const layer1 = document.createElement('div');
        layer1.classList.add('mosaic-layer', 'active'); // Start visible

        const layer2 = document.createElement('div');
        layer2.classList.add('mosaic-layer'); // Start hidden

        cell.appendChild(layer1);
        cell.appendChild(layer2);
        bgSlider.appendChild(cell);

        // Initial Image
        const randomStartImg = getRandomImageNumber();
        layer1.style.backgroundImage = `url('${imageFolder}${randomStartImg}${imageExtension}')`;

        cells.push({
            element: cell,
            activeLayer: layer1,
            nextLayer: layer2,
            currentImage: randomStartImg
        });

        // Schedule first update with random delay to de-sync animations
        scheduleUpdate(cells[i], randomRange(minInterval, maxInterval));
    }

    function getRandomImageNumber() {
        return Math.floor(Math.random() * totalImages) + 1;
    }

    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function scheduleUpdate(cellObj, delay) {
        setTimeout(() => {
            updateCell(cellObj);
        }, delay);
    }

    function updateCell(cellObj) {
        // Pick new random image that is different from current
        let nextImage;
        do {
            nextImage = getRandomImageNumber();
        } while (totalImages > 1 && nextImage === cellObj.currentImage);

        const nextImageUrl = `${imageFolder}${nextImage}${imageExtension}`;

        // Preload
        const img = new Image();
        img.src = nextImageUrl;

        img.onload = () => {
            // Prepare next layer
            cellObj.nextLayer.style.backgroundImage = `url('${nextImageUrl}')`;

            // Swap classes to fade
            cellObj.nextLayer.classList.add('active');
            cellObj.activeLayer.classList.remove('active');

            // Swap references for next time
            const temp = cellObj.activeLayer;
            cellObj.activeLayer = cellObj.nextLayer;
            cellObj.nextLayer = temp;

            cellObj.currentImage = nextImage;

            // Schedule next update randomly
            scheduleUpdate(cellObj, randomRange(minInterval, maxInterval));
        };

        img.onerror = () => {
            console.error(`Failed to load image: ${nextImageUrl}`);
            // Retry quickly or schedule standard delay? Let's just schedule standard delay to avoid loops
            scheduleUpdate(cellObj, randomRange(minInterval, maxInterval));
        };
    }
});
