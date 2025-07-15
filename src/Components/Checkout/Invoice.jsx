import React, { useRef, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router';
import { jsPDF } from 'jspdf';
import Logo from '../../assets/Logo.png';
import useAuth from '../Hooks/UseAuth';

const Invoice = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { amountPaid, transactionId, date, cardHolderName = new Date().toLocaleDateString() } = location.state || {};
    const invoiceRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component is mounted before printing
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);
    useEffect(() => {
        console.log('Location State:', location.state);
    }, []);

    // Debugging - log ref status
    useEffect(() => {
        console.log('Invoice ref status:', invoiceRef.current ? 'Attached' : 'Not attached');
    }, [invoiceRef.current]);

    const handlePDFDownload = () => {
        const doc = new jsPDF();

        // Set initial position and styling
        let yPos = 20;
        const leftMargin = 15;
        const rightMargin = 180;

        // Add logo image (base64 or data URI) - adjust width/height as needed
        const logoImg = Logo; 
        const logoWidth = 20;
        const logoHeight = 20;

        doc.addImage(logoImg, 'JPG', leftMargin, yPos - 10, logoWidth, logoHeight); // Place logo at top-left

        // "MediHurt" title next to or below logo
        doc.setFontSize(22);
        doc.setTextColor(51, 51, 51); // #333
        doc.text('MediHurt', leftMargin + logoWidth + 5, yPos); // Next to logo horizontally

        // Invoice title and date (Right-aligned)
        doc.setFontSize(22);
        doc.text('INVOICE', rightMargin, yPos, { align: 'right' });
        doc.setFontSize(12);
        doc.setTextColor(102, 102, 102); // #666
        doc.text(date, rightMargin, yPos + 7, { align: 'right' });

        yPos += 30;

        // Customer Info
        doc.setFontSize(18);
        doc.setTextColor(51, 51, 51);
        doc.text('Billed To:', leftMargin, yPos);
        doc.setFontSize(14);
        yPos += 10;
        doc.text(cardHolderName || 'Customer Name', leftMargin, yPos);
        yPos += 7;
        doc.setTextColor(102, 102, 102);
        doc.text(user?.email || 'customer@example.com', leftMargin, yPos);

        yPos += 20;

        // Purchase Summary
        doc.setFontSize(18);
        doc.setTextColor(51, 51, 51);
        doc.text('Purchase Summary:', leftMargin, yPos);
        yPos += 15;

        // Table Header
        doc.setFontSize(12);
        doc.setTextColor(51, 51, 51);
        doc.text('Description', leftMargin, yPos);
        doc.text('Amount', rightMargin, yPos, { align: 'right' });

        // Horizontal line
        yPos += 5;
        doc.line(leftMargin, yPos, 195, yPos);

        // Table Rows
        yPos += 10;
        doc.text('Total Payment', leftMargin, yPos);
        doc.text(`Taka: ${amountPaid?.toFixed(2) || '0.00'}`, rightMargin, yPos, { align: 'right' });

        yPos += 10;
        doc.text('Transaction ID', leftMargin, yPos);
        doc.text(transactionId || 'N/A', rightMargin, yPos, { align: 'right' });

        yPos += 20;

        // Footer line
        doc.line(leftMargin, yPos, 195, yPos);
        yPos += 15;

        // Grand Total
        const grandTotalLabel = 'Grand Total:';
        const totalText = `${amountPaid?.toFixed(2) || '0.00'}`;
        doc.setFontSize(16);
        doc.setTextColor(51, 51, 51);

        const grandTotalTextWidth = doc.getTextWidth(`${grandTotalLabel} ${totalText}`);
        doc.text(`${grandTotalLabel} ${totalText}`, 195 - grandTotalTextWidth, yPos);

        // Save PDF
        doc.save(`Invoice-${transactionId || 'unknown'}.pdf`);
    };



    const handlePrint = () => {
        if (!amountPaid || !transactionId) {
            alert('Invoice data is missing. Cannot generate PDF.');
            return;
        }
        handlePDFDownload()
    };

    return (
        <div className="container w-11/12 mx-auto py-10 px-4">
            <div className="flex justify-end mb-6">
                <button
                    onClick={handlePrint}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md shadow"
                    disabled={!isMounted}
                >
                    {isMounted ? 'Download Invoice as PDF' : 'Preparing...'}
                </button>
            </div>

            {/* Printable content with explicit ref */}
            <div
                ref={invoiceRef}
                className=" p-8 border border-gray-200 rounded-lg bg-white shadow-sm print-content"
                // style={{ maxWidth: '800px' }}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center">
                        <img src={Logo} alt="MediHurt Logo" className="h-12 mr-3" />
                        <h1 className="text-2xl font-bold text-gray-800">MediHurt</h1>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                        <p className="text-gray-600 text-sm">{date}</p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Billed To:</h3>
                    <p className="text-gray-800">{cardHolderName || 'Customer Name'}</p>
                    <p className="text-gray-600">{user?.email || 'customer@example.com'}</p>
                </div>

                {/* Transaction Details */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Purchase Summary:</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-bold text-gray-700">Description</th>
                                    <th className="text-right py-3 px-4 font-bold text-gray-700">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-800">Total Payment</td>
                                    <td className="py-3 px-4 text-right text-gray-800">৳{amountPaid?.toFixed(2) || '0.00'}</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-gray-800">Transaction ID</td>
                                    <td className="py-3 px-4 text-right text-gray-800">{transactionId || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 pt-4 border-t border-gray-200">
                    <div className="flex justify-end">
                        <div className="text-right">
                            <p className="text-gray-600 mb-1">Grand Total</p>
                            <p className="text-xl font-bold text-gray-800">৳{amountPaid?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link
                    to="/shop"
                    className="inline-block px-5 py-2 text-teal-600 hover:text-teal-700 font-medium border border-teal-800 rounded-md hover:bg-teal-50 transition-colors"
                >
                    ← Back to Shop
                </Link>
            </div>
        </div>
    );
};

export default Invoice;