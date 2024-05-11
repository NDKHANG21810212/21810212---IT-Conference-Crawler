document.addEventListener('DOMContentLoaded', function() {

    // Hàm fetch dữ liệu và hiển thị sự kiện
    function fetchDataAndDisplayEvents() {
        fetch('/data/combined_data.json')
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date();
            data.forEach(event => {
                const eventStartDate = new Date(event.startDate);
                const eventEndDate = new Date(event.endDate);

                if (currentDate >= eventStartDate && currentDate <= eventEndDate) {
                    event.status = 'ongoing';
                } else if (currentDate < eventStartDate) {
                    event.status = 'upcoming';
                } else {
                    event.status = 'red';
                }
            });

            // Sắp xếp mảng sự kiện theo thứ tự ongoing, upcoming, red
            data.sort((a, b) => {
                const statusOrder = { 'ongoing': 1, 'upcoming': 2, 'red': 3 };
                return statusOrder[a.status] - statusOrder[b.status];
            });
            
            const eventContainer = document.getElementById('eventDetails');
            eventContainer.innerHTML = ''; // Xóa nội dung cũ trước khi thêm dữ liệu mới

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

                const eventHtml = `
                    <div class="event" style="border-color: ${event.status === 'ongoing' ? 'blue' : event.status === 'upcoming' ? 'yellow' : 'red'};">
                        <div class="status-tag" style="background-color: ${statusTagColor}; color: ${statusTagTextColor};">${event.status}</div>
                        <h1>${eventTitle}</h1>
                        <p><strong>Time:</strong> ${eventTime}</p>
                        <p><strong>Date:</strong> ${eventStartDate.toLocaleDateString()} - ${eventEndDate.toLocaleDateString()}</p>
                        <p><strong>Description:</strong> ${eventDescription}</p>
                        <p><strong>Subtitle:</strong> ${eventSubtitle}</p>
                        <a href="${eventUrl}" target="_blank">More Info</a>
                    </div>
                `;

                const eventDiv = document.createElement('div');
                eventDiv.innerHTML = eventHtml;
                eventContainer.appendChild(eventDiv);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    // Gọi hàm fetchDataAndDisplayEvents() khi trang được tải
    fetchDataAndDisplayEvents();

    // Lắng nghe sự kiện click vào nút "Tải lại"
    document.getElementById('reloadButton').addEventListener('click', function() {
        fetchDataAndDisplayEvents(); // Gọi lại hàm để tải lại dữ liệu
    });

    // Lắng nghe sự kiện click vào nút "Tìm kiếm"
    document.getElementById('searchButton').addEventListener('click', function() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const eventTitles = document.querySelectorAll('.event h1');
        
        // Lặp qua tất cả các tiêu đề sự kiện và ẩn hiện dựa trên kết quả tìm kiếm
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

});
