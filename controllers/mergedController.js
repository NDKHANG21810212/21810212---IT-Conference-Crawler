const fs = require('fs').promises;

let hasMerged = false;

async function mergeJsonData() {
    // Nếu đã thực hiện merge trước đó, không cần thực hiện lại
    if (hasMerged) {
        return;
    }

    try {
        // Đọc dữ liệu từ file tech_events.json và API_data.json
        const techEventsData = await fs.readFile('./data/tech_events.json', 'utf8').then(JSON.parse);
        const conferencesData = await fs.readFile('./data/API_data.json', 'utf8').then(JSON.parse);

        // Kiểm tra xem cả hai tệp có rỗng không
        if (isEmpty(techEventsData) || isEmpty(conferencesData)) {
            console.error('One or both data files are empty.');
            return;
        }

        // Ghép hai mảng dữ liệu lại với nhau
        const mergedData = [...techEventsData, ...conferencesData];

        // Lưu dữ liệu mới vào file JSON
        const existingData = await fs.readFile('./data/combined_data.json', 'utf8');
        const existingJson = JSON.parse(existingData);
        const newJson = JSON.stringify(mergedData, null, 2);
        
        if (JSON.stringify(existingJson) !== newJson) {
            await fs.writeFile('./data/combined_data.json', newJson, 'utf8');
            console.log('Data has been saved to combined_data.json');
        } else {
            console.log('No changes in data, skipping file write');
        }
        // Đặt cờ để chỉ thực hiện merge một lần duy nhất
        hasMerged = true;
    } catch (error) {
        console.error('An error occurred while merging data:', error);
    }
}

function isEmpty(obj) {
    return !Array.isArray(obj) ? Object.keys(obj).length === 0 : obj.length === 0;
}

module.exports = mergeJsonData;
