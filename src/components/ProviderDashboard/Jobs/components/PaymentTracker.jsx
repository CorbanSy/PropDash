//levlpro-mvp\src\components\ProviderDashboard\Jobs\components\PaymentTracker.jsx
import { useState } from "react";
import { DollarSign, CheckCircle2, Clock, CreditCard, Calendar } from "lucide-react";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabaseClient";
import { formatCurrency } from "../utils/jobCalculations";

export default function PaymentTracker({ job, onRefresh }) {
  const [recording, setRecording] = useState(false);
  const [paymentData, setPaymentData] = useState({
    method: "cash",
    amount: job.total || 0,
    notes: "",
  });

  const handleRecordPayment = async () => {
    if (!confirm("Record payment as received?")) return;

    setRecording(true);

    const { error } = await supabase
      .from("jobs")
      .update({
        paid: true,
        paid_at: new Date().toISOString(),
        payment_method: paymentData.method,
        payment_notes: paymentData.notes,
        status: "paid",
      })
      .eq("id", job.id);

    if (error) {
      alert("Error recording payment");
      console.error(error);
    } else {
      onRefresh();
    }

    setRecording(false);
  };

  return (
    <div className="space-y-6">
      {/* Payment Status */}
      <div className={`${theme.card.base} ${theme.card.padding} ${
        job.paid ? "bg-gradient-to-br from-emerald-50 to-green-50" : "bg-gradient-to-br from-amber-50 to-orange-50"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${theme.text.h4}`}>Payment Status</h3>
          {job.paid ? (
            <span className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold">
              <CheckCircle2 size={18} />
              PAID
            </span>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-bold">
              <Clock size={18} />
              UNPAID
            </span>
          )}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-1">Total Amount</p>
          <p className="text-4xl font-bold text-slate-900">
            {formatCurrency(job.total || 0)}
          </p>
        </div>

        {job.paid && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Date:</span>
              <span className="font-semibold text-slate-900">
                {new Date(job.paid_at).toLocaleDateString()}
              </span>
            </div>
            {job.payment_method && (
              <div className="flex justify-between">
                <span className="text-slate-600">Method:</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {job.payment_method}
                </span>
              </div>
            )}
            {job.payment_notes && (
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <p className="text-xs text-emerald-700 font-semibold mb-1">Notes:</p>
                <p className="text-sm text-slate-700">{job.payment_notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Record Payment Form */}
      {!job.paid && job.status === "completed" && (
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <h3 className={`${theme.text.h4} mb-4`}>Record Payment</h3>

          <div className="space-y-4">
            {/* Payment Method */}
            <div>
              <label className={theme.text.label}>Payment Method</label>
              <select
                value={paymentData.method}
                onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="credit_card">Credit Card</option>
                <option value="venmo">Venmo</option>
                <option value="zelle">Zelle</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className={theme.text.label}>Amount</label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                  className={`${theme.input.base} ${theme.input.provider} pl-10`}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={theme.text.label}>Notes (Optional)</label>
              <textarea
                value={paymentData.notes}
                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                className={`${theme.input.base} ${theme.input.provider} mt-2`}
                rows={3}
                placeholder="Transaction ID, check number, etc..."
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRecordPayment}
              disabled={recording}
              className={`w-full ${theme.button.provider} justify-center bg-emerald-600 hover:bg-emerald-700 ${
                recording ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <CheckCircle2 size={18} />
              {recording ? "Recording..." : "Record Payment"}
            </button>
          </div>
        </div>
      )}

      {/* Payment History / Receipt */}
      {job.paid && (
        <div className={`${theme.card.base} ${theme.card.padding}`}>
          <h3 className={`${theme.text.h4} mb-4`}>Receipt</h3>
          
          <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-slate-600">Paid To</p>
                <p className="font-semibold text-slate-900">Your Business</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Receipt #</p>
                <p className="font-mono font-semibold text-slate-900">
                  {job.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Service:</span>
                <span className="font-medium text-slate-900">{job.service_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-medium text-slate-900">
                  {new Date(job.scheduled_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method:</span>
                <span className="font-medium text-slate-900 capitalize">
                  {job.payment_method || "Cash"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-900">Total Paid:</span>
                <span className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(job.total || 0)}
                </span>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2">
            <Download size={18} />
            Download Receipt
          </button>
        </div>
      )}
    </div>
  );
}