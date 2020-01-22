const googleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bug-tracker-264723-5da27098ddee.json')
const promisefy = require('util')

const addRowtoSheet = async () => {
    const doc = new googleSpreadSheet('154y1uFatsAIafXSIX2TmhbfsWSbY56-Myz73M4Kq4og')
    await promisefy(doc.useServiceAccountAuth)(credentials)
    console.log('Planilha aberta')
    const info = await promisefy(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisefy(worksheet.addRow)({nome: "Wellington", email: "wellington@pereira"})
}

addRowtoSheet()

// const doc = new googleSpreadSheet('154y1uFatsAIafXSIX2TmhbfsWSbY56-Myz73M4Kq4og')
// doc.useServiceAccountAuth(credentials, (err) => {
//     if(err){
//         console.log('Não foi possível abrir a planilha')
//     } else{
//         console.log('Planilha aberta')
//         doc.getInfo((err, info)  => {

//             const worksheet = info.worksheets[0]
//             worksheet.addRow({nome: "Wellington", email: "wellington@pereira"}, err => {

//             })
//             console.log('Linha inserida')
//         })
//     }
// })