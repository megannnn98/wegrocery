import { t } from "@/lib/i18n";
import { formatMoney } from "@/lib/i18n/format";
import { PAYMENT_CONTACT } from "@/lib/simple-mode";

// Simple mode: the order is paid outside the app. After it is saved the member
// reads how much to transfer, where the bank details are and who to message.
export function PaymentNote({ total }: { total: number }) {
  return (
    <section className="mt-4 rounded-card border border-primary-mid bg-primary-bg p-4 text-foreground">
      <h2 className="text-[15px] font-extrabold">{t.order.simplePay.title}</h2>
      <p className="mt-1 text-[14px] leading-[1.45]">{t.order.simplePay.note(formatMoney(total), PAYMENT_CONTACT)}</p>
      <a href="/ricarica" className="mt-2 inline-block text-[14px] font-bold text-primary-text underline underline-offset-2">
        {t.order.simplePay.details} →
      </a>
    </section>
  );
}
