"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useApi, CalendarMonthDto, CalendarDayDetailDto } from "@/lib/api";
import AddTransactionModal from "@/components/AddTransactionModal";
import { useToast } from "@/components/Toast";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isoMonth(y: number, m: number) {
  return `${y}-${String(m).padStart(2, "0")}`;
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function monthName(y: number, m: number) {
  return new Date(y, m - 1).toLocaleString("en-ZA", { month: "long", year: "numeric" });
}

function fmtAmt(n: number) {
  return `R ${Math.abs(n).toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;
}

function fmtAmtFull(n: number) {
  return `R ${Math.abs(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function startOffset(year: number, month: number) {
  const dow = new Date(year, month - 1, 1).getDay();
  return dow === 0 ? 6 : dow - 1; // Mon-first
}

export default function CalendarPage() {
  const api = useApi();
  const toast = useToast();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthData, setMonthData] = useState<CalendarMonthDto | null>(null);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [monthError, setMonthError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayDetail, setDayDetail] = useState<CalendarDayDetailDto | null>(null);
  const [loadingDay, setLoadingDay] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function loadMonth(y: number, m: number) {
    setLoadingMonth(true);
    setMonthError(false);
    try {
      const data = await api.getCalendarMonth(isoMonth(y, m));
      setMonthData(data);
    } catch {
      setMonthError(true);
      setMonthData(null);
    } finally {
      setLoadingMonth(false);
    }
  }

  async function loadDay(date: string) {
    setSelectedDate(date);
    setDayDetail(null);
    setLoadingDay(true);
    try {
      const data = await api.getCalendarDay(date);
      setDayDetail(data);
    } catch {
      setDayDetail(null);
    } finally {
      setLoadingDay(false);
    }
  }

  useEffect(() => { loadMonth(year, month); }, [year, month]); // eslint-disable-line react-hooks/exhaustive-deps

  function navigate(dir: -1 | 1) {
    let m = month + dir;
    let y = year;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setMonth(m);
    setYear(y);
    setSelectedDate(null);
    setDayDetail(null);
  }

  function handleTransactionCreated() {
    loadMonth(year, month);
    if (selectedDate) loadDay(selectedDate);
    toast("Transaction added");
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = startOffset(year, month);
  const dayMap = new Map((monthData?.days ?? []).map(d => [d.date, d]));
  const today = isoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

  const displayDay = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "long" })
    : null;

  return (
    <>
      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleTransactionCreated}
      />

      <div className="space-y-5 max-w-5xl page-enter">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display font-bold text-2xl">Calendar</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Click any day to see the entries behind the number.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-brand-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-md sm:size-auto sm:gap-2 sm:px-4 sm:py-2.5"
            aria-label="Add transaction"
            title="Add transaction"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add transaction</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar grid */}
          <div className="glass p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold">{monthName(year, month)}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(-1)}
                  className="glass-subtle p-1.5 rounded-lg hover:bg-white/70 transition"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="glass-subtle p-1.5 rounded-lg hover:bg-white/70 transition"
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold py-1" style={{ color: "var(--muted-foreground)" }}>
                  {d}
                </div>
              ))}
            </div>

            {monthError ? (
              <div className="text-center py-8 space-y-2" style={{ color: "var(--muted-foreground)" }}>
                <AlertCircle size={20} className="mx-auto" style={{ color: "var(--destructive)" }} />
                <p className="text-xs">Couldn&apos;t load this month.</p>
              </div>
            ) : (
              <div className={`grid grid-cols-7 gap-1 ${loadingMonth ? "opacity-50" : "fade-in"}`}>
                {Array.from({ length: offset }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = isoDate(year, month, day);
                  const data = dayMap.get(dateStr);
                  const isSelected = dateStr === selectedDate;
                  const isToday = dateStr === today;

                  return (
                    <button
                      key={day}
                      onClick={() => loadDay(dateStr)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs transition-all ${
                        isSelected
                          ? "bg-brand-gradient text-white shadow-md scale-[1.05]"
                          : isToday
                          ? "glass-subtle font-bold"
                          : "hover:bg-white/50 hover:scale-[1.02]"
                      }`}
                    >
                      <span className="font-medium leading-none">{day}</span>
                      {data && data.transactionCount > 0 && (
                        <span
                          className="text-[9px] leading-none tabular-nums"
                          style={{
                            color: isSelected
                              ? "rgba(255,255,255,0.85)"
                              : data.net >= 0
                              ? "var(--status-confirmed)"
                              : "var(--destructive)",
                          }}
                        >
                          {data.net >= 0 ? "+" : "-"}R{Math.abs(data.net).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Day detail panel */}
          <div className="glass p-6 space-y-4">
            <div className="font-display font-semibold">
              {displayDay ?? "Select a day"}
            </div>

            {!selectedDate ? (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Click any day to see its transactions.
              </p>
            ) : loadingDay ? (
              <div className="space-y-2">
                <div className="skeleton h-16 w-full" />
                <div className="skeleton h-16 w-full" />
              </div>
            ) : !dayDetail || dayDetail.transactions.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                No transactions on this day.
              </p>
            ) : (
              <div className="fade-in space-y-3">
                <div className="space-y-2">
                  {dayDetail.transactions.map((tx) => (
                    <div key={tx.id} className="glass-subtle p-3 space-y-0.5">
                      <div className="text-sm font-medium">{tx.description || tx.categoryName || "—"}</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {tx.categoryName ?? tx.transactionSourceName}
                      </div>
                      <div
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: tx.transactionType === "MoneyIn" ? "var(--status-confirmed)" : "var(--foreground)" }}
                      >
                        {tx.transactionType === "MoneyIn" ? "+" : "-"}{fmtAmtFull(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="flex justify-between text-sm font-semibold pt-2 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--muted-foreground)" }}>Day total</span>
                  <span style={{
                    color: dayDetail.totalMoneyIn - dayDetail.totalMoneyOut >= 0
                      ? "var(--status-confirmed)"
                      : "var(--destructive)",
                  }}>
                    {dayDetail.totalMoneyIn - dayDetail.totalMoneyOut >= 0 ? "+" : "-"}
                    {fmtAmt(Math.abs(dayDetail.totalMoneyIn - dayDetail.totalMoneyOut))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
