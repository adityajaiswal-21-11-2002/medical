"use client"

interface InvoiceProps {
  order: any
}

export default function Invoice({ order }: InvoiceProps) {
  const now = new Date()
  const invoiceDate = now.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const company = {
    name: "SANDP HEALTHCARE PVT LTD",
    address: "6/6 KUSTIA ROAD, FIRST FLOOR, WARD NO - 66, TILJALA",
    city: "Kolkata-700039",
    dlNo: "20B-WB/KOL/NBO/W/754323, 21B-WB/KOL/BIO/",
    gstin: "19ABECS3822J1Z4",
    stateCode: "19",
    phone: "9073997719 / 033-23430280",
    bankName: "ICICI BANK",
    branch: "SANTOSHPUR - KOLKATA-700075",
    account: "127505001339",
    ifsc: "ICIC0001275",
  }

  return (
    <div className="p-8 bg-white text-black text-xs" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className="mb-4 border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-base font-bold">{company.name}</h1>
            <p className="text-xs">{company.address}</p>
            <p className="text-xs">{company.city}</p>
            <p className="text-xs">DL No.: {company.dlNo}</p>
            <p className="text-xs">
              GSTIN: {company.gstin} STATE CODE: {company.stateCode}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">PROFORMA INVOICE</h2>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold">Invoice No.: SANDP/{order._id?.toString().slice(-2) || "0"}</p>
          <p>Date: {invoiceDate}</p>
          <p>Due Date: {dueDate}</p>
        </div>
        <div className="text-right">
          <p>Order No.: {order.orderNumber}</p>
          <p>Date: {invoiceDate}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-4 grid grid-cols-2 gap-4 border-y py-2">
        <div>
          <p className="font-bold">Details of Receiver / Billed To</p>
          <p>Name: {order.customerName}</p>
          <p>Address: {order.customerAddress}</p>
          <p>MOB - {order.customerMobile}</p>
          {order.gstin && <p>GSTIN: {order.gstin}</p>}
        </div>
        <div>
          <p className="font-bold">Details of Consignee / Shipped To</p>
          <p>Name: {order.customerName}</p>
          <p>Address: {order.customerAddress}</p>
          <p>Mob.: {order.customerMobile}</p>
          {order.gstin && <p>GSTIN: {order.gstin}</p>}
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full mb-4 border-collapse text-xs">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1 text-left">Sr.</th>
            <th className="px-2 py-1 text-left">ITEM DESCRIPTION</th>
            <th className="px-2 py-1 text-left">HSN</th>
            <th className="px-2 py-1 text-left">MFG.BY</th>
            <th className="px-2 py-1 text-left">PACK</th>
            <th className="px-2 py-1 text-left">BATCH</th>
            <th className="px-2 py-1 text-left">EXP. DATE</th>
            <th className="px-2 py-1 text-right">QTY</th>
            <th className="px-2 py-1 text-right">Free Qty</th>
            <th className="px-2 py-1 text-right">RATE</th>
            <th className="px-2 py-1 text-right">AMOUNT</th>
            <th className="px-2 py-1 text-right">SGST%</th>
            <th className="px-2 py-1 text-right">CGST%</th>
            <th className="px-2 py-1 text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item: any, index: number) => (
            <tr key={index} className="border-b">
              <td className="px-2 py-1">{index + 1}</td>
              <td className="px-2 py-1">{item.product?.name || "N/A"}</td>
              <td className="px-2 py-1">30049099</td>
              <td className="px-2 py-1">SALUD</td>
              <td className="px-2 py-1">1*10</td>
              <td className="px-2 py-1">{item.batch}</td>
              <td className="px-2 py-1">{item.expiry}</td>
              <td className="px-2 py-1 text-right">{item.quantity}</td>
              <td className="px-2 py-1 text-right">{item.freeQuantity}</td>
              <td className="px-2 py-1 text-right">{item.rate?.toFixed(2)}</td>
              <td className="px-2 py-1 text-right">{(item.quantity * item.rate)?.toFixed(2)}</td>
              <td className="px-2 py-1 text-right">2.5%</td>
              <td className="px-2 py-1 text-right">2.5%</td>
              <td className="px-2 py-1 text-right">{((item.sgst || 0) + (item.cgst || 0))?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold">Amount in Words:</p>
          <p>{numberToWords(Math.floor(order.netAmount || 0))} Rupees Only</p>
        </div>
        <div className="text-right">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b">
                <td className="px-2 py-1 font-bold">Gross Value:</td>
                <td className="px-2 py-1 text-right">₹{order.subtotal?.toFixed(2) || "0.00"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-2 py-1 font-bold">Discount Value:</td>
                <td className="px-2 py-1 text-right">₹{order.totalDiscount?.toFixed(2) || "0.00"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-2 py-1 font-bold">GST TAX Value:</td>
                <td className="px-2 py-1 text-right">₹{order.totalGst?.toFixed(2) || "0.00"}</td>
              </tr>
              <tr className="bg-slate-100 font-bold">
                <td className="px-2 py-1">PAYABLE VALUE:</td>
                <td className="px-2 py-1 text-right">₹{order.netAmount?.toFixed(2) || "0.00"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Details */}
      <div className="mb-4 border-t pt-2">
        <p className="font-bold">BANK DETAILS:</p>
        <p>{company.name}</p>
        <p>bank details - {company.bankName}</p>
        <p>BRANCH - {company.branch}</p>
        <p>ACCOUNT - {company.account}</p>
        <p>IFSC CODE - {company.ifsc}</p>
      </div>

      {/* Terms */}
      <div className="mb-4">
        <p className="font-bold">Terms & Conditions:</p>
        <ol className="text-xs list-decimal ml-4">
          <li>All Dispute subject to Kolkata jurisdiction only.</li>
          <li>Interest @ 24% P.A. will be charged on delayed payments.</li>
          <li>Goods once sold will not be taken back or exchanged.</li>
        </ol>
      </div>

      {/* Signature */}
      <div className="flex justify-between items-end">
        <div className="text-center">
          <p>For {company.name}</p>
          <p className="mt-6">_________________</p>
          <p className="text-xs">AUTHORISED SIGNATORY</p>
        </div>
        <div className="text-center">
          <p>Date: {invoiceDate}</p>
        </div>
      </div>

      <p className="text-center text-xs mt-4">Ph.: {company.phone}</p>
    </div>
  )
}

function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  if (num === 0) return "Zero"

  function helper(n: number): string {
    if (n === 0) return ""
    else if (n < 10) return ones[n]
    else if (n < 20) return teens[n - 10]
    else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
    else if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + helper(n % 100) : "")
    else if (n < 100000)
      return helper(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + helper(n % 1000) : "")
    else if (n < 10000000)
      return helper(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + helper(n % 100000) : "")
    else return helper(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + helper(n % 10000000) : "")
  }

  return helper(num)
}
