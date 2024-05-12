    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('leftMenu').addEventListener('click', function(event) {
            // Kiểm tra xem phần tử theo class 'menuOption' được click không
            if (event.target.classList.contains('menuOption')) {
                const status = event.target.dataset.status; // Lấy  thuộc tính data-status
                filterEventsByStatus(status); // Gọi hàm để lọc sự kiện theo trạng thái 'ongoing','upcoming', 'completed'
            }
        });
        
        function filterEventsByStatus(status) {
            const eventDivs = document.querySelectorAll('.event');
            eventDivs.forEach(eventDiv => {
                const eventStatus = eventDiv.querySelector('.status-tag').textContent.toLowerCase();
                if (status === 'all' || eventStatus === status) {
                    eventDiv.style.display = 'block'; // Hiển thị sự kiện nếu trạng thái khớp
                } else {
                    eventDiv.style.display = 'none'; // Ẩn sự kiện nếu trạng thái không khớp
                }
            });
        }
        document.addEventListener('DOMContentLoaded', function() {
        //  để hiển thị tên sự kiện khi click a
        function displayEventName(event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ a
            const eventName = event.target.dataset.eventName; // Lấy tên sự kiện 
            alert(eventName); // Hiển thị tên sự kiện
        }

        // Thêm sự kiện click cho tất cả các thẻ a 
        const eventLinks = document.querySelectorAll('.event a');
        eventLinks.forEach(link => {
            link.addEventListener('click', displayEventName);
        });
    });
        // Hàm fetch dữ liệu và hiển thị sự kiện
        function fetchDataAndDisplayEvents() {
            fetch('/data/combined_data.json')
            .then(response => response.json())
            .then(data => {
                function calculateDaysLeft(eventStartDate) {
                    const currentDate = new Date();
                    const difference = eventStartDate - currentDate;
                    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24)); // Chuyển từ milliseconds sang ngày và làm tròn lên
                    return daysLeft;
                }
                data.forEach(event => {
                    const eventStartDate = new Date(event.startDate);
                    const eventEndDate = new Date(event.endDate);
                    let status = '';
                    const currentDate = new Date();

                    if (currentDate >= eventStartDate && currentDate <= eventEndDate) {
                        event.status = 'ongoing';
                    } else if (currentDate < eventStartDate) {
                        event.status = 'upcoming';
                    } else {
                        event.status = 'completed';
                    }
                    const daysLeft = calculateDaysLeft(eventStartDate);
                
                   event.daysLeft = daysLeft; 
                     });
                function updateClock() {
                    const now = new Date();
                    const day = now.getDate();
                    const month = now.getMonth() + 1; 
                    const year = now.getFullYear();
                    const hours = now.getHours();
                    const minutes = now.getMinutes();
                    const seconds = now.getSeconds();
                    const clockElement = document.getElementById('clock');
                    clockElement.textContent = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                }
                setInterval(updateClock, 1000);
                updateClock();
                data.sort((a, b) => {
                    const statusOrder = { 'ongoing': 1, 'upcoming': 2, 'completed': 3 };
                    return statusOrder[a.status] - statusOrder[b.status];
                });
                const eventContainer = document.getElementById('eventDetails');
                eventContainer.innerHTML = ''; 
                let eventIndex = 1;
                data.forEach(event => {
                    const eventName = event.name;
                    const eventStartDate = new Date(event.startDate);
                    const eventEndDate = new Date(event.endDate);
                    const eventDescription = event.description;
                    const eventUrl = event.url;
                    const eventSubtitle = event.subtitle;
                    const eventTime = event.time;
                    const eventTitle = event.title;
                    let statusTagColor = '';
                    let statusTagTextColor = '';
                    if (event.status === 'ongoing') {
                        statusTagColor = 'blue';
                        statusTagTextColor = 'white';
                    } else if (event.status === 'upcoming') {
                        statusTagColor = 'yellow';
                        statusTagTextColor = 'red';
                    } else {
                        statusTagColor = 'red';
                        statusTagTextColor = 'white';
                    }
                    let favoriteEvents = [];
                    try {
                        const storedEvents = localStorage.getItem('favoriteEvents');
                        if (storedEvents) {
                            favoriteEvents = JSON.parse(storedEvents);
                        }
                    } catch (error) {
                        console.error('Error parsing favorite events:', error);
                    }
                    const isFavorite = favoriteEvents.includes(eventName);
                    
                    const eventHtml = `
                        <div class="event" style="border-color: ${event.status === 'ongoing' ? 'blue' : event.status === 'upcoming' ? 'yellow' : 'red'};">
                            <div class="status-tag" style="background-color: ${statusTagColor}; color: ${statusTagTextColor};">${event.status}</div>
                            <div class="days-left ${ event.status === 'completed' ? 'Completed' : event.status === 'ongoing' ? 'Today' : event.daysLeft === 1 ? 'Tomorrow' : ''}">${
                                event.status === 'completed' ? 'Completed' : event.status === 'ongoing' ? 'Today' : event.daysLeft === 1 ? 'Tomorrow' :`${event.daysLeft} days left`
                            } </div>
                            <h1>${eventTitle}</h1>
                            <p><strong>Time:</strong> ${eventTime}</p>
                            <p><strong>Date:</strong> ${eventStartDate.toLocaleDateString()} - ${eventEndDate.toLocaleDateString()}</p>
                            <p><strong>Location:</strong> ${eventDescription}</p>
                            <p><strong>Subtitle:</strong> ${eventSubtitle}</p>
                            <a href="${eventUrl}" target="_blank">More Info</a>
                            <button class="favorite-button" data-event="${eventName}" style="background-color: ${isFavorite ? 'yellow' : 'transparent'};">${isFavorite ? 'Unfavorite' : 'Favorite'}</button>
                        </div>
                    `;
                    eventIndex++;

                    const eventDiv = document.createElement('div');
                    eventDiv.innerHTML = eventHtml;
                    eventContainer.appendChild(eventDiv);
                    
                    // sự kiện click vào nút "Favorite"
                    const favoriteButton = eventDiv.querySelector('.favorite-button');
                    favoriteButton.addEventListener('click', function() {
                        const event = this.dataset.event;
                        const index = favoriteEvents.indexOf(event);
                        if (index !== -1) {
                            // Nếu đã được yêu thích, hãy xóa nó khỏi Local Storage
                            favoriteEvents.splice(index, 1);
                        } else {
                            // Nếu sự kiện chưa được yêu thích, thêm vào danh sách yêu thích trong Local Storage
                            favoriteEvents.push(event);
                        }
                        // Lưu trữ danh sách yêu thích vào Local Storage
                        localStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents));
                        // Cập nhật lại giao diện
                        fetchDataAndDisplayEvents();
                    });
                });

                // Hiển thị danh sách yêu thích
                const favoriteEventsList = document.getElementById('favoriteEvents');
                favoriteEventsList.innerHTML = '<h2>Yêu thích</h2>';
                favoriteEvents.forEach(eventName => {
                    const listItem = document.createElement('li');
                    listItem.textContent = eventName;
                    favoriteEventsList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
        }

        // Gọi hàm  khi trang được tải
        fetchDataAndDisplayEvents();

        
        document.getElementById('reloadButton').addEventListener('click', function() {
            location.reload();
            fetchDataAndDisplayEvents(); 
        

        });

        //  nút "Tìm kiếm"
        document.getElementById('searchButton').addEventListener('click', function() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const eventTitles = document.querySelectorAll('.event h1');
            eventTitles.forEach(title => {
                const eventDiv = title.parentElement;
                const eventName = title.textContent.toLowerCase();
                if (eventName.includes(searchInput)) {
                    eventDiv.style.display = 'block'; // Hiển thị sự kiện nếu tên sự kiện chứa từ khóa tìm kiếm
                } else {
                    eventDiv.style.display = 'none'; // Ẩn sự kiện nếu không khớp với từ khóa tìm kiếm
                }
            });
        });
        document.getElementById('showFavoritesButton').addEventListener('click', function() {
            const favoriteEvents = JSON.parse(localStorage.getItem('favoriteEvents')) || [];
            const eventContainers = document.querySelectorAll('.event');
            eventContainers.forEach(container => {
                const eventName = container.querySelector('h1').innerText ;
                if (favoriteEvents.includes(eventName)) {
                    container.style.display = 'block'; // Hiển thị sự kiện 
                } else {
                    container.style.display = 'none'; // Ẩn sự kiện 
                }
            });
        });

        // nút "Hiển thị tất cả"
        document.getElementById('showAllButton').addEventListener('click', function() {
            location.reload();
            });
    
            function addEventToList(eventName, eventUrl) {
                if (!isEventInList(eventName)) {
                // Tạo một phần tử <li> mới
                const listItem = document.createElement('li');
                // Tạo thẻ <a> và gán thuộc tính href
                const link = document.createElement('a');
                link.textContent = eventName;
                link.href = eventUrl;
                link.target = "_blank"; 
                link.style.color = "blue"; 
                link.style.textDecoration = "none"; 
                // Thêm thẻ <a> vào <li>
                listItem.appendChild(link);
                // Lấy danh sách <ul> trong right menu
                const eventList = document.getElementById('eventList');
                // Thêm <li> vào danh sách
                eventList.appendChild(listItem);
                saveEventListToLocalStorage();
            }
        }
        function isEventInList(eventName) {
            const eventListItems = document.querySelectorAll('#eventList li');
            for (let listItem of eventListItems) {
                if (listItem.textContent === eventName) {
                    return true;
                }
            }
            return false;
        }

      //Chuyen danh sach su kien sang right menu
        document.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                // Lấy tên sự kiện từ thẻ <h1> trong phần tử .event
                const eventName = event.target.parentElement.querySelector('h1').textContent;
                const eventUrl = event.target.href;
                // Thêm tên sự kiện vào danh sách
                addEventToList(eventName, eventUrl);
            }
        
        });
        function saveEventListToLocalStorage() {
            const eventList = document.getElementById('eventList').innerHTML;
            localStorage.setItem('eventList', eventList);
        }
        
        // Hàm lấy danh sách sự kiện từ Local Storage
        function loadEventListFromLocalStorage() {
            const eventList = localStorage.getItem('eventList');
            if (eventList) {
                const eventListContainer = document.getElementById('eventList');
                eventListContainer.innerHTML = eventList;
            }
        }
        loadEventListFromLocalStorage();
        
    });

        


