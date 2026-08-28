document.addEventListener("DOMContentLoaded", () => {
    // Map controls
    const mapViewport = document.getElementById("mapViewport");
    const cityMap = document.getElementById("cityMap");
    const zoomIn = document.getElementById("zoomIn");
    const zoomOut = document.getElementById("zoomOut");
    const resetMap = document.getElementById("resetMap");
    const zoomValue = document.getElementById("zoomValue");

    if (!mapViewport || !cityMap) {
        return;
    }

    let scale = 1;
    let positionX = 0;
    let positionY = 0;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startPositionX = 0;
    let startPositionY = 0;

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 2.5;
    const ZOOM_STEP = 0.1;

   // Update the map
    function updateMap() {
        cityMap.style.transform =  `translate(${positionX}px, ${positionY}px) scale(${scale})`;
        if (zoomValue) {
            zoomValue.textContent = `${Math.round(scale * 100)}%`;
        }
    }

    // Keep the map from being dragged too far
    function clampPosition() {
        const maxX = (mapViewport.clientWidth * (scale - 1)) / 2;

        const maxY = (mapViewport.clientHeight * (scale - 1)) / 2;

        positionX = Math.max(-maxX,Math.min(maxX, positionX));

        positionY = Math.max(
            -maxY,
            Math.min(maxY, positionY)
        );
    }


    // Change the zoom
    function setZoom(newScale) {

        scale = Math.max(
            MIN_ZOOM,
            Math.min(MAX_ZOOM, newScale)
        );

        if (scale === 1) {
            positionX = 0;
            positionY = 0;
        } else {
            clampPosition();
        }

        updateMap();
    }


    // Zoom in
    if (zoomIn) {

        zoomIn.addEventListener("click", () => {
            setZoom(scale + ZOOM_STEP);
        });

    }


    // Zoom out
    if (zoomOut) {

        zoomOut.addEventListener("click", () => {
            setZoom(scale - ZOOM_STEP);
        });

    }


    // Reset the map
    if (resetMap) {

        resetMap.addEventListener("click", () => {

            scale = 1;
            positionX = 0;
            positionY = 0;

            updateMap();
        });

    }


    // Zoom with the mouse wheel
    mapViewport.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();

            const direction =
                event.deltaY < 0 ? 1 : -1;

            setZoom(
                scale + direction * ZOOM_STEP
            );
        },
        { passive: false }
    );


    // Start dragging the map
    mapViewport.addEventListener(
        "mousedown",
        (event) => {

            dragging = true;

            startX = event.clientX;
            startY = event.clientY;

            startPositionX = positionX;
            startPositionY = positionY;

            mapViewport.classList.add("dragging");
        }
    );


    // Move the map
    window.addEventListener(
        "mousemove",
        (event) => {

            if (!dragging) {
                return;
            }

            positionX =
                startPositionX +
                (event.clientX - startX);

            positionY =
                startPositionY +
                (event.clientY - startY);

            clampPosition();
            updateMap();
        }
    );


    // Stop dragging
    window.addEventListener(
        "mouseup",
        () => {

            dragging = false;

            mapViewport.classList.remove("dragging");
        }
    );


    // Stop dragging if the mouse leaves the map
    mapViewport.addEventListener(
        "mouseleave",
        () => {

            if (dragging) {

                dragging = false;

                mapViewport.classList.remove("dragging");
            }
        }
    );


    // Set the starting map position
    updateMap();


    // Smooth navigation
    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        event.preventDefault();
                        return;
                    }

                    const target =
                        document.querySelector(targetId);

                    if (target) {

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                }
            );
        });

});
