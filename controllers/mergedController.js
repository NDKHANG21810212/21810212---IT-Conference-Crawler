const fs = require('fs').promises;

async function mergeJsonData() {
    let techEventsData, conferencesData;
    while (true) {
        try {
            // Đọc dữ liệu từ file tech_events.json và API_data.json
            techEventsData = await fs.readFile('./data/tech_events.json', 'utf8').then(JSON.parse);
            conferencesData = await fs.readFile('./data/API_data.json', 'utf8').then(JSON.parse);

            // Kiểm tra xem cả hai tệp có rỗng không
            if (!isEmpty(techEventsData) && !isEmpty(conferencesData)) {
                break; // Nếu có dữ liệu, thoát khỏi vòng lặp
            }

            // Nếu không có dữ liệu, đợi 1 giây trước khi tiếp tục lặp
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('An error occurred while reading data:', error);
            return; // Nếu có lỗi, thoát khỏi hàm
        }
    }

    // Ghép hai mảng dữ liệu lại với nhau
    const mergedData = [...techEventsData, ...conferencesData];

    try {
        // Lưu dữ liệu mới vào file JSON
        await fs.writeFile('./data/combined_data.json', JSON.stringify(mergedData, null, 4));
        console.log('Merged data has been saved to data/combined_data.json');
    } catch (error) {
        console.error('An error occurred while writing data:', error);
    }
}

function isEmpty(obj) {
    return !Array.isArray(obj) ? Object.keys(obj).length === 0 : obj.length === 0;
}

module.exports = mergeJsonData();
