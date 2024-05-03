// Utilized in populating index and menu pages with data from the API
window.onload = async function () {
    // Loads the events from the API and renders them in the events-container
    if (document.querySelector("#events-container")) {
        const response = await fetch("/api/events")
        let events = await response.json()

        // Sorts the events by date in ascending order
        events = events.sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
        })

        // Populates the event headers using event names/ids
        const eventsContainer = document.querySelector("#events-container")
        eventsContainer.innerHTML = ""
        for (const event of events) {
            const eventElement = document.createElement("div")
            eventElement.className = "col-md-4 mb-4"
            eventElement.innerHTML = `
                <div class="card bg-light">
                    <div class="card-body">
                        <h5 class="card-title text-secondary cursor-pointer text-center">${event.event}</h5>
                        <div id="${event._id}" class="event-details" style="display: none;"></div>
                    </div>`
            eventsContainer.appendChild(eventElement)
        }
    }

    // Loads event details card when the event title is clicked
    if (document.querySelector("#events-container")) {
        const eventsContainer = document.querySelector("#events-container")
        eventsContainer.addEventListener("click", async function (event) {
            if (event.target.className.includes("card-title")) {
            const eventDetails = event.target.nextElementSibling
            const eventId = eventDetails.id
        
            if (eventDetails.innerHTML === "") {
                const response = await fetch(`/api/events/${eventId}`)
                const eventData = await response.json()
        
                eventDetails.innerHTML = `
                <p class="card-text text-center"><b>Location:</b> ${eventData.location}</p>
                <p class="card-text text-center"><b>Date:</b> ${eventData.date}</p>
                <p class="card-text text-center"><b>Time:</b> ${eventData.hours}</p>
                `
            }
        
            if (eventDetails.style.display === "none") {
                eventDetails.style.display = "block"
            } else {
                eventDetails.style.display = "none"
            }
            }
        })
    }

    // Loads the menu from the API and renders them in the menu-container
    if (document.querySelector("#menu-container")) {
        const response = await fetch("/api/menu")
        const menu = await response.json()

        const menuContainer = document.querySelector("#menu-container")
        menuContainer.innerHTML = ""
        // Populates the menu container
        for (const menuItem of menu) {
            const menuItemElement = document.createElement("div")
            menuItemElement.className = "col-md-4 mb-4"
            menuItemElement.innerHTML = `
                <div class="card bg-light">
                    <img src="${menuItem.imageUrl}" class="card-img-top" alt="${menuItem.name}">
                    <div class="card-body">
                        <h5 class="card-title text-secondary cursor-pointer text-center">${menuItem.name}</h5>
                        <div class="menu-details">
                            <p class="card-text"><b>Description:</b> ${menuItem.description}</p>
                            <p class="card-text"><b>Price: </b>$${menuItem.price}</p>
                        </div>
                    </div>
                </div>
            `
            menuContainer.appendChild(menuItemElement)
        }
    }

    // Updates the event select dropdown on the admin page
    if (document.querySelector("#updateEventForm")) {
        const selectEventUpdate = document.getElementById("selectEventUpdate")
        const deleteEventUpdate = document.getElementById("deleteEventUpdate")

        // Populates the event select dropdowns and selects the first event
        populateEventDelete(deleteEventUpdate)
        const firstEventId = await populateEventUpdate(selectEventUpdate)
        populateEventUpdate(selectEventUpdate)
        if (firstEventId) {
            loadEventDetails({ target: { value: firstEventId } })
        }

        const selectMenuUpdate = document.getElementById("selectMenuUpdate")
        const deleteMenuUpdate = document.getElementById("deleteMenuUpdate")

        // Populates the event select dropdowns and selects the first event
        populateMenuDelete(deleteMenuUpdate)
        populateMenuUpdate(selectMenuUpdate)
        const firstMenuItemId = await populateMenuUpdate(selectMenuUpdate)
        if (firstMenuItemId) {
            loadMenuDetails({ target: { value: firstMenuItemId } })
        }
    }
}

// Sets up event listeners for the admin page forms
if (document.querySelector("#updateEventForm")) {
    // Event Addition Form
    const addEventForm = document.getElementById("addEventForm")
    addEventForm.addEventListener("submit", addEvent)
    // Event Select Dropdown
    const eventSelect = document.getElementById("selectEventUpdate")
    eventSelect.addEventListener("change", loadEventDetails)
    // Event Update Form
    const updateEventForm = document.getElementById("updateEventForm")
    updateEventForm.addEventListener("submit", updateEvent)
    // Event Delete Form
    const deleteEventForm = document.getElementById("deleteEventForm")
    deleteEventForm.addEventListener("submit", deleteEvent)

    // Menu Item Addition Form
    const addMenuForm = document.getElementById("addMenuForm")
    addMenuForm.addEventListener("submit", addMenuItem)
    // Menu Select Dropdown
    const menuSelect = document.getElementById("selectMenuUpdate")
    menuSelect.addEventListener("change", loadMenuDetails)
    // Menu Update Form
    const updateMenuForm = document.getElementById("updateMenuForm")
    updateMenuForm.addEventListener("submit", updateMenuItem)
    // Menu Delete Form
    const deleteMenuForm = document.getElementById("deleteMenuForm")
    deleteMenuForm.addEventListener("submit", deleteMenuItem)
}

// Displays confirmation or error message based on success/failure
function displayConfirmation(isSuccess, successMessage, errorMessage) {
    const confirmation = document.getElementById("confirmation")
    if (isSuccess) {
        confirmation.innerHTML = successMessage
        confirmation.className = "alert alert-success"
    } else {
        confirmation.innerHTML = errorMessage
        confirmation.className = "alert alert-danger"
    }
}

// Event Add/Update/Delete Forms
// Function to handle event addition form submission
async function addEvent(event) {
    event.preventDefault()
    const eventName = document.getElementById("event").value
    const location = document.getElementById("location").value
    const date = document.getElementById("date").value
    const hours = document.getElementById("hours").value

    const response = await fetch("/api/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ event: eventName, location, date, hours }),
    })

    const data = await response.json()
    console.log(data)

    // Clear the form and display confirmation message
    event.target.reset()
    // Clears and reloads the update/delete forms
    if (response.ok) {
        populateEventUpdate(selectEventUpdate)
        populateEventDelete(deleteEventUpdate)
    }
    displayConfirmation(
        response.ok,
        "Event added successfully!",
        "Failed to add event."
    )
}

// Function to populate the event select dropdown
async function populateEventUpdate(selectEventUpdate) {
    const response = await fetch("/api/events")
    const events = await response.json()
    // Populates the event select dropdown
    selectEventUpdate.innerHTML = ""
    for (const event of events) {
        const option = document.createElement("option")
        option.value = event._id
        option.innerText = event.event

        // Populates the event Update dropdown
        selectEventUpdate.appendChild(option)
    }

    // Used to populate the event details for the first event in the dropdown
    if (events.length > 0) {
        return events[0]._id
    } else {
        return null
    }
}

// Function to populate the event select dropdown
async function populateEventDelete(deleteEventUpdate) {
    const response = await fetch("/api/events")
    const events = await response.json()
    // Populates the event select dropdown
    deleteEventUpdate.innerHTML = ""
    for (const event of events) {
        const option = document.createElement("option")
        option.value = event._id
        option.innerText = event.event

        // Populates the event Update dropdown
        deleteEventUpdate.appendChild(option)
    }
}

// Function that fetches the event details and populates the form fields
async function loadEventDetails(event) {
    const id = event.target.value
    const response = await fetch(`/api/events/${id}`)
    const eventData = await response.json()
    // Populates the form fields with the event details
    document.getElementById("eventUpdate").value = eventData.event
    document.getElementById("locationUpdate").value = eventData.location
    document.getElementById("dateUpdate").value = eventData.date
    document.getElementById("hoursUpdate").value = eventData.hours
}

// Function that updates the event details
async function updateEvent(event) {
    event.preventDefault() // Prevents default form submission
    // Fetches the event details from the form
    const id = document.getElementById("selectEventUpdate").value
    const eventName = document.getElementById("eventUpdate").value
    const location = document.getElementById("locationUpdate").value
    const date = document.getElementById("dateUpdate").value
    const hours = document.getElementById("hoursUpdate").value

    // Sends a PUT request to the API to update the event
    const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ event: eventName, location, date, hours }),
    })

    // Displays a confirmation message based on the response
    const data = await response.json()
    console.log(data)
    displayConfirmation(
        response.ok,
        "Event updated successfully!",
        "Failed to update event."
    )

    // Clears and reloads the update/delete forms
    if (response.ok) {
        const selectEventUpdate = document.getElementById("selectEventUpdate")
        const firstEventId = await populateEventUpdate(selectEventUpdate)
        if (firstEventId) {
            loadEventDetails({ target: { value: firstEventId } })
        }
        populateEventDelete(deleteEventUpdate)
    }
}

// Function that deletes the selected event
async function deleteEvent(event) {
    event.preventDefault() // Prevents default form submission
    const id = document.getElementById("deleteEventUpdate").value
    const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
    })

    // Displays a confirmation message based on the response
    const data = await response.json()
    console.log(data)
    displayConfirmation(
        response.ok,
        "Event deleted successfully!",
        "Failed to delete event."
    )

    // Clears and reloads the update/delete forms
    if (response.ok) {
        populateEventUpdate(selectEventUpdate)
        populateEventDelete(deleteEventUpdate)
    }
}

// Menu Add/Update/Delete Forms

// Menu Item Addition Form
async function addMenuItem(event) {
    event.preventDefault()
    const name = document.getElementById("name").value
    const description = document.getElementById("description").value
    const price = document.getElementById("price").value
    const imageUrl = document.getElementById("imageUrl").value

    const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, price, imageUrl }),
    })

    // Clear the form and display confirmation message
    event.target.reset()
    // Clears and reloads the update/delete forms
    if (response.ok) {
        populateMenuUpdate(selectMenuUpdate)
        populateMenuDelete(deleteMenuUpdate)
    }
    displayConfirmation(
        response.ok,
        "Menu Item added successfully!",
        "Failed to add Menu Item."
    )
}

// Function to populate the menu select dropdown
async function populateMenuUpdate(selectMenuUpdate) {
    const response = await fetch("/api/menu")
    const menu = await response.json()
    // Populates the menu select dropdown
    selectMenuUpdate.innerHTML = ""
    for (const menuItem of menu) {
        const option = document.createElement("option")
        option.value = menuItem._id
        option.innerText = menuItem.name

        // Populates the menu Update dropdown
        selectMenuUpdate.appendChild(option)
    }
    // Used to populate the menu details for the first menu item in the dropdown
    if (menu.length > 0) {
        return menu[0]._id
    } else {
        return null
    }
}

// Function to popualte the delete menu dropdown
async function populateMenuDelete(deleteMenuUpdate) {
    const response = await fetch("/api/menu")
    const menu = await response.json()
    // Populates the menu select dropdown
    deleteMenuUpdate.innerHTML = ""
    for (const menuItem of menu) {
        const option = document.createElement("option")
        option.value = menuItem._id
        option.innerText = menuItem.name

        // Populates the menu Update dropdown
        deleteMenuUpdate.appendChild(option)
    }
}

// Function that fetches the menu details and populates the form fields
async function loadMenuDetails(event) {
    const id = event.target.value
    const response = await fetch(`/api/menu/${id}`)
    const menuItem = await response.json()
    // Populates the form fields with the menu details
    document.getElementById("nameUpdate").value = menuItem.name
    document.getElementById("descriptionUpdate").value = menuItem.description
    document.getElementById("priceUpdate").value = menuItem.price
    document.getElementById("imageUpdate").value = menuItem.imageUrl
}

// Function that updates the menu details
async function updateMenuItem(event) {
    event.preventDefault() // Prevents default form submission
    // Fetches the menu details from the form
    const id = document.getElementById("selectMenuUpdate").value
    const name = document.getElementById("nameUpdate").value
    const description = document.getElementById("descriptionUpdate").value
    const price = document.getElementById("priceUpdate").value
    const imageUrl = document.getElementById("imageUpdate").value

    // Sends a PUT request to the API to update the menu item
    const response = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, price, imageUrl }),
    })

    // Displays a confirmation message based on the response
    const data = await response.json()
    console.log(data)
    displayConfirmation(
        response.ok,
        "Menu item updated successfully!",
        "Failed to update menu item."
    )

    // Clears and reloads the update/delete forms
    if (response.ok) {
        const selectMenuUpdate = document.getElementById("selectMenuUpdate")
        const firstMenuItemId = await populateMenuUpdate(selectMenuUpdate)
        if (firstMenuItemId) {
            loadMenuDetails({ target: { value: firstMenuItemId } })
        }
        populateMenuDelete(deleteMenuUpdate)
    }
}

// Deletes the selected menu item
async function deleteMenuItem(event) {
    event.preventDefault() // Prevents default form submission
    const id = document.getElementById("deleteMenuUpdate").value
    const response = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
    })

    // Displays a confirmation message based on the response
    const data = await response.json()
    console.log(data)
    displayConfirmation(
        response.ok,
        "Menu item deleted successfully!",
        "Failed to delete menu item."
    )

    // Clears and reloads the update/delete forms
    if (response.ok) {
        populateMenuUpdate(selectMenuUpdate)
        populateMenuDelete(deleteMenuUpdate)
    }
}
