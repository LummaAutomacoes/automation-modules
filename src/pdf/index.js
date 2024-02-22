import axios from 'axios';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import pdf from 'pdf-parse';

export async function qtyPagesPdfs(filePath) {
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const numberOfPages = pdfDoc.getPageCount();

    return numberOfPages
}

export async function extractPagesFromPdf(inputFilePath, startPage, endPage, outputFilePath) {
    // Carrega o documento PDF original
    const existingPdfBytes = fs.readFileSync(inputFilePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Cria um novo documento PDF para as páginas extraídas
    const newPdfDoc = await PDFDocument.create();

    // Ajusta os índices das páginas para base 0
    startPage -= 1;
    endPage -= 1;

    // Verifica se os índices das páginas são válidos
    if (startPage < 0 || endPage >= pdfDoc.getPageCount() || startPage > endPage) {
        throw new Error('Invalid page numbers.');
    }

    // Copia as páginas especificadas para o novo documento
    const pagesToCopy = await newPdfDoc.copyPages(pdfDoc, Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
    pagesToCopy.forEach(page => newPdfDoc.addPage(page));

    // Salva o novo documento PDF
    const newPdfBytes = await newPdfDoc.save();
    fs.writeFileSync(outputFilePath, newPdfBytes);

    // console.log(`Pages from ${startPage + 1} to ${endPage + 1} extracted to ${outputFilePath}`);
}

export async function downloadPDF(url, outputPath) {
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const writer = fs.createWriteStream(outputPath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Erro ao baixar o arquivo:', error);
    }
}

export async function PdfToText(path) {

    let dataBuffer = fs.readFileSync(path);

    return new Promise((resolve, reject) => {
        pdf(dataBuffer).then(function (data) {

            let textoPdf = data.text

            resolve(textoPdf);

        }).catch(err => {
            console.error(err)
        })
    });
}