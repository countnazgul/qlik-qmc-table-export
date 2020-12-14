type IReturn = {
    error: boolean;
    message?: string;
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "getTableData") {
            let csvData = getTableData();
            sendResponse(csvData);
        }

        if (request.message === "check") {
            let checkData = checkForTables()
            sendResponse(checkData);
        }
    }
);

function checkForTables(): IReturn {
    let headers = document.querySelectorAll('qmc-table qmc-table-columns table')

    if (headers.length == 0) return {
        error: true,
        message: 'No tables were found'
    }

    if (headers.length > 1) return {
        error: true,
        message: 'More than one table found'
    }

    return { error: false }
}

function getTableData(): IReturn {
    let headers = document.querySelectorAll('qmc-table qmc-table-columns table thead tr th')

    let data = []
    let h = []

    for (let header of headers) {
        let text = header.innerText.replace(/\"/g, "\"\"").replace(/[\n\r]+/g, "").replace(/[\t]+/g, "").replace(/[^a-zA-Z0-9 ]+/g, "")
            ;
        h.push(`${text}`)
    }

    data.push(h.join(','))

    let table = document.querySelectorAll('qmc-table qmc-table-rows .tableContainer table')

    for (var i = 0, row; row = table[0].rows[i]; i++) {
        let rowData = []
        for (var j = 0, col; col = row.cells[j]; j++) {
            let text = col.innerText.replace(/\"/g, "\"\"");
            rowData.push(`${text}`)
        }

        data.push(rowData.join(','))
    }

    return {
        error: false,
        message: data.join('\n')
    }
}