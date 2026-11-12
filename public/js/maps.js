
document.addEventListener("DOMContentLoaded", () => {

    // OpenStreetMap Tile Layer
    function addMapTiles(map) {

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,

                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        ).addTo(map);

    }

    // Safe popup content
    function createPopup(listing) {

        const container = document.createElement("div");

        const title = document.createElement("h6");
        title.textContent = listing.title || "Listing";

        const location = document.createElement("p");
        location.textContent =
            `${listing.location || ""}, ${listing.country || ""}`;

        const price = document.createElement("p");
        price.textContent =
            `Price: ₹${Number(listing.price || 0).toLocaleString("en-IN")}`;

        const link = document.createElement("a");
        link.href = `/listings/${encodeURIComponent(listing.id)}`;
        link.textContent = "View Listing";
        link.className = "btn btn-sm btn-dark";

        container.appendChild(title);
        container.appendChild(location);
        container.appendChild(price);
        container.appendChild(link);

        return container;
    }

    // Individual Listing Map
    const individualMapElement =
        document.getElementById("individualMap");

    if (individualMapElement) {

        const latitude = Number(
            individualMapElement.dataset.latitude
        );

        const longitude = Number(
            individualMapElement.dataset.longitude
        );

        if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
        ) {

            const map = L.map("individualMap").setView(
                [latitude, longitude],
                13
            );

            addMapTiles(map);

            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(
                    `<strong>${individualMapElement.dataset.title || "Listing"}</strong>`
                )
                .openPopup();

            setTimeout(() => {
                map.invalidateSize();
            }, 100);

        }

    }

    // All Listings Map
    const allMapElement =
        document.getElementById("allListingsMap");

    if (allMapElement) {

        const dataElement =
            document.getElementById("map-listings-data");

        let listings = [];

        try {

            listings = JSON.parse(dataElement.textContent);

        } catch (error) {

            console.error("Unable to read map listings:", error);

        }

        const map = L.map("allListingsMap");

        addMapTiles(map);

        const validListings = listings.filter(listing => {

            return (
                Number.isFinite(listing.latitude) &&
                Number.isFinite(listing.longitude) &&
                listing.latitude >= -90 &&
                listing.latitude <= 90 &&
                listing.longitude >= -180 &&
                listing.longitude <= 180
            );

        });

        const countElement =
            document.getElementById("mapListingCount");

        countElement.textContent =
            `${validListings.length} listing(s) found on the map`;

        if (validListings.length === 0) {

            map.setView([20.5937, 78.9629], 4);

            return;

        }

        const markers = [];

        validListings.forEach(listing => {

            const marker = L.marker([
                listing.latitude,
                listing.longitude
            ]).addTo(map);

            marker.bindPopup(createPopup(listing));

            markers.push(marker);

        });

        const markerGroup = L.featureGroup(markers);

        map.fitBounds(markerGroup.getBounds(), {
            padding: [40, 40],
            maxZoom: 12
        });

        setTimeout(() => {
            map.invalidateSize();
        }, 100);

    }

});
