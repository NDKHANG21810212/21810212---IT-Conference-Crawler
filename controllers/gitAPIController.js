const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');

async function convertConferenceData() {
    try {
        const url = 'https://ccfddl.github.io/conference/allconf.yml';
        
        // Gửi yêu cầu HTTP để tải dữ liệu từ URL
        const response = await axios.get(url);

        // Kiểm tra xem yêu cầu đã thành công không
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data, status code: ${response.status}`);
        }

        // Chuyển đổi dữ liệu từ YAML sang JSON
        const yamlData = response.data;
        const jsonData = yaml.load(yamlData);

        const newData = jsonData.map(conf => ({
            name: conf.title,
            startDate: conf.confs[0].date,
            endDate: conf.confs[0].date, // Giả sử hội nghị chỉ diễn ra trong một ngày
            description: conf.description,
            url: conf.confs[0].link,
            title: conf.title,
            subtitle: conf.description,
            time: conf.confs[0].date // Sử dụng ngày diễn ra hội nghị làm thời gian
        }));

        // Lưu dữ liệu mới vào file JSON
        const existingData = fs.readFileSync('./data/API_data.json', 'utf8');
    const existingJson = JSON.parse(existingData);
    const newJson = JSON.stringify(newData, null, 2);
    
    if (JSON.stringify(existingJson) !== newJson) {
        fs.writeFileSync('./data/API_data.json', newJson, 'utf8');
        console.log('Data has been saved to API_data.json');
    } else {
        console.log('No changes in data, skipping file write');
    }
    }
    catch (error) {
        console.error(error);
    };}

// Gọi hàm để thực thi quá trình chuyển đổi dữ liệu hội nghị
module.exports = convertConferenceData;
