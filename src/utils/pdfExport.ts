import jsPDF from 'jspdf';

export interface ProductHuntPost {
  name: string;
  tagline: string;
  votesCount: number;
  createdAt: string;
  url: string;
}

// Helper function to wrap text
const wrapText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number = 5): number => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = doc.getTextWidth(testLine);
    
    if (testWidth > maxWidth && i > 0) {
      doc.text(line, x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  
  doc.text(line, x, currentY);
  return currentY + lineHeight;
};

export const exportToPDF = (posts: ProductHuntPost[], sortField: string, sortDirection: string) => {
  const doc = new jsPDF();
  
  // Set up the document
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Product Hunt Top 10 Analysis', 20, 30);
  
  // Add subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
  doc.text(`Sorted by: ${sortField} (${sortDirection})`, 20, 47);
  doc.text(`Data from: Past 10 days`, 20, 54);
  
  // Add a line separator
  doc.setLineWidth(0.5);
  doc.line(20, 60, 190, 60);
  
  // Set up table headers
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  const startY = 70;
  const colWidths = [15, 50, 80, 20, 25];
  const headers = ['Rank', 'Product Name', 'Tagline', 'Votes', 'Launch Date'];
  
  // Draw table headers
  let currentX = 20;
  headers.forEach((header, index) => {
    doc.rect(currentX, startY, colWidths[index], 8);
    doc.text(header, currentX + 2, startY + 5);
    currentX += colWidths[index];
  });
  
  // Add data rows
  doc.setFont('helvetica', 'normal');
  let currentY = startY + 8;
  
  posts.forEach((post, index) => {
    // Check if we need a new page
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    
    // Calculate row height based on content
    const nameLines = Math.ceil(doc.getTextWidth(post.name) / colWidths[1]);
    const taglineLines = Math.ceil(doc.getTextWidth(post.tagline) / colWidths[2]);
    const maxLines = Math.max(nameLines, taglineLines, 1);
    const rowHeight = Math.max(maxLines * 5, 8);
    
    currentX = 20;
    
    // Draw row background
    headers.forEach((_, colIndex) => {
      doc.rect(currentX, currentY, colWidths[colIndex], rowHeight);
      currentX += colWidths[colIndex];
    });
    
    // Add content
    currentX = 20;
    
    // Rank
    doc.text((index + 1).toString(), currentX + 2, currentY + 5);
    currentX += colWidths[0];
    
    // Product Name (with wrapping)
    const nameY = wrapText(doc, post.name, currentX + 2, currentY + 5, colWidths[1] - 4);
    currentX += colWidths[1];
    
    // Tagline (with wrapping)
    const taglineY = wrapText(doc, post.tagline, currentX + 2, currentY + 5, colWidths[2] - 4);
    currentX += colWidths[2];
    
    // Votes
    doc.text(post.votesCount.toLocaleString(), currentX + 2, currentY + 5);
    currentX += colWidths[3];
    
    // Launch Date
    doc.text(new Date(post.createdAt).toLocaleDateString(), currentX + 2, currentY + 5);
    
    // Move to next row based on the tallest content
    currentY += Math.max(nameY - currentY, taglineY - currentY, rowHeight);
  });
  
  // Add summary statistics
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, currentY + 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const totalVotes = posts.reduce((sum, post) => sum + post.votesCount, 0);
  const avgVotes = Math.round(totalVotes / posts.length);
  const highestVotes = Math.max(...posts.map(post => post.votesCount));
  const lowestVotes = Math.min(...posts.map(post => post.votesCount));
  
  doc.text(`Total Votes: ${totalVotes.toLocaleString()}`, 20, currentY + 30);
  doc.text(`Average Votes: ${avgVotes.toLocaleString()}`, 20, currentY + 37);
  doc.text(`Highest Votes: ${highestVotes.toLocaleString()}`, 20, currentY + 44);
  doc.text(`Lowest Votes: ${lowestVotes.toLocaleString()}`, 20, currentY + 51);
  
  // Add detailed product information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Product Information', 20, currentY + 70);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  let detailY = currentY + 80;
  
  posts.forEach((post, index) => {
    // Check if we need a new page
    if (detailY > 270) {
      doc.addPage();
      detailY = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${post.name}`, 20, detailY);
    detailY += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Tagline: ${post.tagline}`, 20, detailY);
    detailY += 7;
    
    doc.text(`Votes: ${post.votesCount.toLocaleString()}`, 20, detailY);
    detailY += 7;
    
    doc.text(`Launch Date: ${new Date(post.createdAt).toLocaleDateString()}`, 20, detailY);
    detailY += 7;
    
    doc.text(`URL: ${post.url}`, 20, detailY);
    detailY += 12; // Extra space between products
  });
  
  // Add footer
  doc.setFontSize(8);
  doc.text('Generated by Product Hunt Top 10 Viewer', 20, 290);
  doc.text(`https://github.com/ChimdumebiNebolisa/producthunt-top10`, 20, 295);
  
  // Save the PDF
  const fileName = `producthunt-top10-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
