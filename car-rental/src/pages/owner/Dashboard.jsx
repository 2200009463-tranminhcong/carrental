import React, { useEffect, useRef, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import api from '../../utils/api'

//PHẦN DOANH THU ─── Period helper ─────────────────────────────────────────────────────────────
const PERIODS = [
    { label: 'Hôm qua', value: 'yesterday' },
    { label: 'Hôm nay', value: 'today' },
    { label: '7 ngày qua', value: '7days' },
    { label: '30 ngày qua', value: '30days' },
    { label: '90 ngày qua', value: '90days' },
]

/** Return { start, end, prevStart, prevEnd, categories } for a period key */
const getPeriodRange = (periodValue) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (periodValue) {
        case 'today': {
            const start = today
            const end = now
            const prevStart = new Date(today); prevStart.setDate(prevStart.getDate() - 1)
            const prevEnd = new Date(today)
            const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`)
            return { start, end, prevStart, prevEnd, bucketFn: d => d.getHours(), buckets: 24, categories: hours }
        }
        case 'yesterday': {
            const start = new Date(today); start.setDate(start.getDate() - 1)
            const end = new Date(today)
            const prevStart = new Date(today); prevStart.setDate(prevStart.getDate() - 2)
            const prevEnd = new Date(today); prevEnd.setDate(prevEnd.getDate() - 1)
            const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`)
            return { start, end, prevStart, prevEnd, bucketFn: d => d.getHours(), buckets: 24, categories: hours }
        }
        case '7days': {
            const start = new Date(today); start.setDate(start.getDate() - 6)
            const end = now
            const prevStart = new Date(today); prevStart.setDate(prevStart.getDate() - 13)
            const prevEnd = new Date(today); prevEnd.setDate(prevEnd.getDate() - 7)
            const cats = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(today); d.setDate(d.getDate() - 6 + i)
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
            })
            return {
                start, end, prevStart, prevEnd, bucketFn: d => {
                    const diff = Math.floor((d - start) / 86400000); return Math.min(diff, 6)
                }, buckets: 7, categories: cats
            }
        }
        case '30days': {
            const start = new Date(today); start.setDate(start.getDate() - 29)
            const end = now
            const prevStart = new Date(today); prevStart.setDate(prevStart.getDate() - 59)
            const prevEnd = new Date(today); prevEnd.setDate(prevEnd.getDate() - 30)
            const cats = Array.from({ length: 30 }, (_, i) => {
                const d = new Date(today); d.setDate(d.getDate() - 29 + i)
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
            })
            return {
                start, end, prevStart, prevEnd, bucketFn: d => {
                    const diff = Math.floor((d - start) / 86400000); return Math.min(diff, 29)
                }, buckets: 30, categories: cats
            }
        }
        case '90days':
        default: {
            const start = new Date(today); start.setDate(start.getDate() - 89)
            const end = now
            const prevStart = new Date(today); prevStart.setDate(prevStart.getDate() - 179)
            const prevEnd = new Date(today); prevEnd.setDate(prevEnd.getDate() - 90)
            // group by week (13 weeks)
            const cats = Array.from({ length: 13 }, (_, i) => `T${i + 1}`)
            return {
                start, end, prevStart, prevEnd, bucketFn: d => {
                    const diff = Math.floor((d - start) / (7 * 86400000)); return Math.min(diff, 12)
                }, buckets: 13, categories: cats
            }
        }
    }
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const currency = '₫ '

    const [data, setData] = useState({
        totalCars: 0,
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        recentBookings: [],
        monthlyRevenue: 0,
        paidBookings: 0,
        unpaidBookings: 0,
        failedBookings: 0,
    })
    const [allBookings, setAllBookings] = useState([])

    const dashboardCards = [
        { title: 'Tổng số lượng xe', value: data.totalCars, icon: assets.carIconColored },
        { title: 'Tổng lượt đặt', value: data.totalBookings, icon: assets.listIconColored },
        { title: 'Chờ duyệt', value: data.pendingBookings, icon: assets.cautionIconColored },
        { title: 'Đã xác nhận', value: data.completedBookings, icon: assets.listIconColored },
    ]

    useEffect(() => {
        const fetch = async () => {
            try {
                const carsRes = await api.get('/cars')
                const bookingsRes = await api.get('/bookings')
                const cars = carsRes.data.success ? carsRes.data.data : []
                const bookings = bookingsRes.data.success ? bookingsRes.data.data : []

                const totalCars = cars.length
                const totalBookings = bookings.length
                const pendingBookings = bookings.filter(b => b.status === 'pending').length
                const completedBookings = bookings.filter(b => b.status === 'confirmed').length
                const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length

                const paidBookings = bookings.filter(b => b.paymentStatus === 'paid').length
                const unpaidBookings = bookings.filter(b => b.paymentStatus === 'unpaid').length
                const failedBookings = bookings.filter(b => b.paymentStatus === 'failed').length

                const sorted = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                const recentBookings = sorted.slice(0, 6)

                const cm = new Date().getMonth(), cy = new Date().getFullYear()
                const monthlyRevenue = bookings.reduce((s, b) => {
                    const d = new Date(b.createdAt)
                    return (b.status === 'confirmed' && d.getMonth() === cm && d.getFullYear() === cy)
                        ? s + b.totalPrice : s
                }, 0)

                setAllBookings(bookings)
                setData({ totalCars, totalBookings, pendingBookings, completedBookings, cancelledBookings, recentBookings, monthlyRevenue, paidBookings, unpaidBookings, failedBookings })
            } catch (e) { console.error(e) }
        }
        fetch()
    }, [])

    return (
        <div className="px-4 pt-10 md:px-10 flex-1">
            <Title
                title="Trang tổng quan"
                subTitle="Theo dõi hiệu suất tổng thể của nền tảng, bao gồm tổng số xe, số lượt đặt chỗ, doanh thu và các hoạt động gần đây."
            />

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
                {dashboardCards.map((card, i) => (
                    <div key={i} className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor bg-gray-100 shadow-sm">
                        <div>
                            <h1 className="text-xs text-gray-700">{card.title}</h1>
                            <p className="text-lg font-semibold text-black">{card.value}</p>
                        </div>
                        <div className="bg-blue-200 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <img src={card.icon} alt="" className="h-4 w-4" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 1: Recent Bookings + Status Chart */}
            <div className='flex flex-wrap xl:flex-nowrap items-start gap-6 mb-8 w-full'>
                {/* Recent Bookings */}
                <div className="p-4 md:p-6 border border-borderColor bg-gray-50 shadow-sm rounded-md flex-1 min-w-[300px] w-full">
                    <h1 className="text-black text-lg font-medium">Đặt xe gần đây</h1>
                    <p className="text-gray-500 text-sm">Các đơn đặt xe mới nhất của khách hàng</p>

                    {data.recentBookings.length === 0
                        ? <div className="mt-4 text-gray-500">Chưa có dữ liệu đặt xe.</div>
                        : data.recentBookings.map((booking, i) => (
                            <div key={i} className="text-black mt-4 flex items-center justify-between border-b pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-200 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                        <img src={assets.listIconColored} alt="" className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{booking.car?.name}</p>
                                        <p className="text-xs text-gray-500">{booking.createdAt?.split('T')[0]}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 font-medium">
                                    <p className="text-sm text-green-600">{currency}{booking.totalPrice.toLocaleString()}</p>
                                    <p className={`px-2 py-0.5 border border-borderColor rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {booking.status === 'confirmed' ? 'Đã XN' :
                                            booking.status === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Booking Status Chart */}
                <BookingStatusChart bookings={allBookings} />
            </div>

            {/* Row 2: Revenue Chart + Payment Pie Chart */}
            <div className='flex flex-wrap xl:flex-nowrap items-start gap-6 mb-8 w-full'>
                <RevenueChart currency={currency} />
                <PaymentStatusPieChart bookings={allBookings} />
            </div>
        </div>
    )
}

// ─── Revenue Chart with period selector ────────────────────────────────────────
const RevenueChart = ({ currency }) => {
    const [period, setPeriod] = useState('7days')
    const [open, setOpen] = useState(false)
    const [chartData, setChartData] = useState({ confirmed: [], pending: [], categories: [] })
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [pctChange, setPctChange] = useState(null) // null = no data for prev
    const dropdownRef = useRef(null)

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/bookings')
                const bookings = res.data.success ? res.data.data : []
                const { start, end, prevStart, prevEnd, bucketFn, buckets, categories } = getPeriodRange(period)

                const confirmed = Array(buckets).fill(0)
                const pending = Array(buckets).fill(0)
                let total = 0, prevTotal = 0

                bookings.forEach(b => {
                    const d = new Date(b.createdAt)
                    if (d >= start && d <= end) {
                        const idx = bucketFn(d)
                        if (idx >= 0 && idx < buckets) {
                            if (b.status === 'confirmed') { confirmed[idx] += b.totalPrice; total += b.totalPrice }
                            else if (b.status === 'pending') pending[idx] += b.totalPrice
                        }
                    }
                    if (d >= prevStart && d < prevEnd && b.status === 'confirmed') prevTotal += b.totalPrice
                })

                const pct = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null
                setChartData({ confirmed, pending, categories })
                setTotalRevenue(total)
                setPctChange(pct)
            } catch (e) { console.error(e) }
        }
        load()
    }, [period])

    const series = [
        {
            name: 'Đã xác nhận',
            data: chartData.confirmed,
        },
        {
            name: 'Chờ duyệt',
            data: chartData.pending,
        },
    ]

    const options = {
        chart: {
            type: 'area',
            height: 180,
            fontFamily: 'Inter, sans-serif',
            background: 'transparent',
            dropShadow: { enabled: false },
            toolbar: { show: false },
            sparkline: { enabled: false },
        },
        colors: ['#ffffff', '#60a5fa'],
        fill: {
            type: 'gradient',
            gradient: {
                type: 'vertical',
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.02,
                stops: [0, 100],
                colorStops: [
                    [
                        { offset: 0, color: '#60a5fa', opacity: 0.5 },
                        { offset: 100, color: '#1e3a5f', opacity: 0.02 },
                    ],
                    [
                        { offset: 0, color: '#93c5fd', opacity: 0.3 },
                        { offset: 100, color: '#1e3a5f', opacity: 0 },
                    ],
                ],
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            width: [3, 2],
            curve: 'smooth',
            colors: ['#e2eeff', '#60a5fa'],
        },
        legend: { show: false },
        tooltip: {
            enabled: true,
            theme: 'dark',
            style: { fontSize: '13px', fontFamily: 'Inter, sans-serif' },
            x: {
                show: true,
                formatter: (_, { dataPointIndex }) =>
                    chartData.categories[dataPointIndex] ?? '',
            },
            y: { formatter: v => `${v.toLocaleString()} ₫` },
            marker: { show: true },
        },
        grid: {
            show: false,
            padding: { left: 0, right: 0, top: -20, bottom: 0 },
        },
        xaxis: {
            categories: chartData.categories,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            show: false,
        },
    }

    const currentPeriodLabel = PERIODS.find(p => p.value === period)?.label || '7 ngày qua'
    const isPositive = pctChange !== null && pctChange >= 0

    return (
        <div
            className="flex-1 min-w-[300px] w-full rounded-2xl p-5 md:p-6 flex flex-col shadow-md border border-indigo-100"
            style={{ background: 'linear-gradient(145deg, #eef2ff 0%, #e0e7ff 100%)' }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h2 className="text-2xl font-bold text-indigo-900 leading-tight tracking-tight">
                        {currency}{totalRevenue.toLocaleString()}
                    </h2>
                    <p className="text-sm text-indigo-500 mt-1">Doanh thu {currentPeriodLabel.toLowerCase()}</p>
                </div>

                {/* % change badge */}
                {pctChange !== null && (
                    <div className={`flex items-center gap-0.5 text-sm font-semibold px-2 py-0.5 rounded-full
                        ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPositive
                            ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v13m0-13 4 4m-4-4-4 4" /></svg>
                            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18V5m0 13-4-4m4 4 4-4" /></svg>
                        }
                        {Math.abs(pctChange)}%
                    </div>
                )}
            </div>

            {/* Chart */}
            <div className="-mx-3 mt-1">
                <ReactApexChart options={options} series={series} type="area" height={180} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-indigo-200 pt-4 mt-2">
                {/* Period dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="bg-indigo-200 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-900 transition-colors"
                        type="button"
                    >
                        {currentPeriodLabel}
                        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                        </svg>
                    </button>

                    {open && (
                        <div className="absolute bottom-full mb-2 left-0 z-20 rounded-xl shadow-lg w-44 py-1 overflow-hidden bg-white"
                            style={{ border: '1px solid #c7d2fe' }}>
                            {PERIODS.map(p => (
                                <button
                                    key={p.value}
                                    onClick={() => { setPeriod(p.value); setOpen(false) }}
                                    className={`bg-indigo-50 w-full text-left px-3 py-2 text-sm transition-colors
                                        ${period === p.value
                                            ? 'text-indigo-700 font-semibold bg-indigo-50'
                                            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-800'}`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Progress report link */}
                <a
                    href="/owner/manage-bookings"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    Báo cáo tiến độ
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

// ─── Booking Status Chart ───────────────────────────────────────────────────────
const BookingStatusChart = ({ bookings = [] }) => {
    const [showDetails, setShowDetails] = useState(false)
    const dropdownRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [period, setPeriod] = useState('7 ngày qua')

    const STATUS_PERIODS = ['Hôm qua', 'Hôm nay', '7 ngày qua', '30 ngày qua', '90 ngày qua']

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const filterByPeriod = (bks, periodLabel) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        switch (periodLabel) {
            case 'Hôm nay':
                return bks.filter(b => new Date(b.createdAt) >= today)
            case 'Hôm qua': {
                const start = new Date(today); start.setDate(start.getDate() - 1)
                return bks.filter(b => { const d = new Date(b.createdAt); return d >= start && d < today })
            }
            case '7 ngày qua': {
                const start = new Date(today); start.setDate(start.getDate() - 6)
                return bks.filter(b => new Date(b.createdAt) >= start)
            }
            case '30 ngày qua': {
                const start = new Date(today); start.setDate(start.getDate() - 29)
                return bks.filter(b => new Date(b.createdAt) >= start)
            }
            case '90 ngày qua': {
                const start = new Date(today); start.setDate(start.getDate() - 89)
                return bks.filter(b => new Date(b.createdAt) >= start)
            }
            default:
                return bks
        }
    }
    const filtered = filterByPeriod(bookings, period)
    const pending = filtered.filter(b => b.status === 'pending').length
    const confirmed = filtered.filter(b => b.status === 'confirmed').length
    const cancelled = filtered.filter(b => b.status === 'cancelled').length
    const total = filtered.length
    const safeTotal = total || 1
    const pendingPct = Math.round((pending / safeTotal) * 100)
    const confirmedPct = Math.round((confirmed / safeTotal) * 100)
    const cancelledPct = Math.round((cancelled / safeTotal) * 100)

    const completionRate = confirmedPct

    const chartOptions = {
        colors: ['#f59e0b', '#10b981', '#ef4444'],
        chart: {
            height: 280,
            width: '100%',
            type: 'radialBar',
            sparkline: { enabled: true },
            fontFamily: 'Inter, sans-serif',
        },
        plotOptions: {
            radialBar: {
                track: { background: '#e5e7eb' },
                dataLabels: { show: false },
                hollow: { margin: 0, size: '32%' },
            },
        },
        grid: {
            show: false,
            padding: { left: 2, right: 2, top: -23, bottom: -20 },
        },
        labels: ['Chờ duyệt', 'Đã xác nhận', 'Đã hủy'],
        legend: {
            show: true,
            position: 'bottom',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            markers: { width: 10, height: 10, radius: 10 },
        },
        tooltip: {
            enabled: true,
            y: { formatter: (v) => `${v}%` },
        },
    }

    return (
        <div className="max-w-sm w-full bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold text-gray-800">Trạng thái đặt xe</h5>
            </div>

            {/* Status Boxes */}
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                <div className="grid grid-cols-3 gap-3 mb-3">
                    {/* Chờ duyệt */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg flex flex-col items-center justify-center h-[78px]">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 text-sm font-semibold flex items-center justify-center mb-1">
                            {pending}
                        </div>
                        <span className="text-amber-600 text-xs font-medium text-center leading-tight">Chờ duyệt</span>
                    </div>
                    {/* Đã xác nhận */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col items-center justify-center h-[78px]">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold flex items-center justify-center mb-1">
                            {confirmed}
                        </div>
                        <span className="text-emerald-700 text-xs font-medium text-center leading-tight">Đã xác nhận</span>
                    </div>
                    {/* Đã hủy */}
                    <div className="bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center h-[78px]">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-semibold flex items-center justify-center mb-1">
                            {cancelled}
                        </div>
                        <span className="text-red-600 text-xs font-medium text-center leading-tight">Đã hủy</span>
                    </div>
                </div>

                {/* Toggle Details */}
                <button
                    onClick={() => setShowDetails(v => !v)}
                    className="bg-indigo-50 flex items-center gap-1 text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors"
                    type="button"
                >
                    {showDetails ? 'Ẩn chi tiết' : 'Xem thêm chi tiết'}
                    <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                </button>

                {/* Expanded Details */}
                {showDetails && (
                    <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                        <dl className="flex items-center justify-between">
                            <dt className="text-gray-500 text-sm">Tỷ lệ xác nhận:</dt>
                            <dd className="inline-flex items-center bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-1.5 py-0.5 rounded">
                                <svg className="w-4 h-4 me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v13m0-13 4 4m-4-4-4 4" />
                                </svg>
                                {completionRate}%
                            </dd>
                        </dl>
                        <dl className="flex items-center justify-between">
                            <dt className="text-gray-500 text-sm">Tổng đơn đặt xe:</dt>
                            <dd className="inline-flex items-center bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded">
                                {total} đơn
                            </dd>
                        </dl>
                        <dl className="flex items-center justify-between">
                            <dt className="text-gray-500 text-sm">Tỷ lệ hủy:</dt>
                            <dd className="inline-flex items-center bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-1.5 py-0.5 rounded">
                                {cancelledPct}%
                            </dd>
                        </dl>
                    </div>
                )}
            </div>

            {/* Radial Chart */}
            <div className="py-2">
                <ReactApexChart
                    key={`status-${period}`}
                    options={chartOptions}
                    series={[pendingPct, confirmedPct, cancelledPct]}
                    type="radialBar"
                    height={280}
                />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
                {/* Period dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="bg-indigo-100 flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                        type="button"
                    >
                        {period}
                        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                        </svg>
                    </button>
                    {open && (
                        <div className="absolute bottom-full mb-2 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-40 py-1 overflow-hidden">
                            {STATUS_PERIODS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => { setPeriod(p); setOpen(false) }}
                                    className={`w-full bg-white text-left px-3 py-2 text-sm transition-colors
                                        ${period === p ? 'text-indigo-700 font-semibold bg-indigo-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <a
                    href="/owner/manage-bookings"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    Xem báo cáo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

// ─── Payment Status Pie Chart ──────────────────────────────────────────────────
const PaymentStatusPieChart = ({ bookings = [] }) => {
    const dropdownRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [period, setPeriod] = useState('Tất cả')

    const PAYMENT_PERIODS = ['Tất cả', 'Hôm nay', '7 ngày qua', '30 ngày qua']

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const filterByPeriodPayment = (bks, periodLabel) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        switch (periodLabel) {
            case 'Hôm nay':
                return bks.filter(b => new Date(b.createdAt) >= today)
            case '7 ngày qua': {
                const start = new Date(today); start.setDate(start.getDate() - 6)
                return bks.filter(b => new Date(b.createdAt) >= start)
            }
            case '30 ngày qua': {
                const start = new Date(today); start.setDate(start.getDate() - 29)
                return bks.filter(b => new Date(b.createdAt) >= start)
            }
            case 'Tất cả':
            default:
                return bks
        }
    }
    const filtered = filterByPeriodPayment(bookings, period)
    const paid = filtered.filter(b => b.paymentStatus === 'paid').length
    const unpaid = filtered.filter(b => b.paymentStatus === 'unpaid').length
    const failed = filtered.filter(b => b.paymentStatus === 'failed').length
    const total = paid + unpaid + failed || 1
    const paidPct = Math.round((paid / total) * 100)
    const unpaidPct = Math.round((unpaid / total) * 100)
    const failedPct = Math.round((failed / total) * 100)

    const chartOptions = {
        colors: ['#10b981', '#f59e0b', '#ef4444'],
        chart: {
            height: 280,
            width: '100%',
            type: 'pie',
            fontFamily: 'Inter, sans-serif',
            toolbar: { show: false },
        },
        stroke: {
            colors: ['#ffffff'],
            width: 2,
        },
        plotOptions: {
            pie: {
                labels: { show: true },
                size: '100%',
                dataLabels: { offset: -20 },
            },
        },
        labels: ['Đã thanh toán', 'Chưa thanh toán', 'Thất bại'],
        dataLabels: {
            enabled: true,
            formatter: (val) => `${Math.round(val)}%`,
            style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: '600',
            },
            dropShadow: { enabled: false },
        },
        legend: {
            position: 'bottom',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            markers: { width: 10, height: 10, radius: 10 },
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val) => `${val} đơn`,
            },
        },
    }

    return (
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-start w-full mb-4">
                <div>
                    <h5 className="text-lg font-semibold text-gray-800">Trạng thái thanh toán</h5>
                    <p className="text-sm text-gray-500 mt-0.5">Tỷ lệ đã / chưa thanh toán</p>
                </div>
            </div>

            {/* Summary Boxes */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col items-center justify-center py-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center mb-1">
                        {paid}
                    </div>
                    <span className="text-emerald-700 text-xs font-medium text-center leading-tight">Đã TT</span>
                    <span className="text-emerald-500 text-xs">{paidPct}%</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg flex flex-col items-center justify-center py-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-sm font-bold flex items-center justify-center mb-1">
                        {unpaid}
                    </div>
                    <span className="text-amber-700 text-xs font-medium text-center leading-tight">Chưa TT</span>
                    <span className="text-amber-500 text-xs">{unpaidPct}%</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center py-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center mb-1">
                        {failed}
                    </div>
                    <span className="text-red-600 text-xs font-medium text-center leading-tight">Thất bại</span>
                    <span className="text-red-400 text-xs">{failedPct}%</span>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="py-2">
                <ReactApexChart
                    key={`payment-${period}`}
                    options={chartOptions}
                    series={[paid, unpaid, failed]}
                    type="pie"
                    height={280}
                />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="bg-indigo-100 flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                        type="button"
                    >
                        {period}
                        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                        </svg>
                    </button>
                    {open && (
                        <div className="absolute bottom-full mb-2 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-40 py-1 overflow-hidden">
                            {PAYMENT_PERIODS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => { setPeriod(p); setOpen(false) }}
                                    className={`bg-white w-full text-left px-3 py-2 text-sm transition-colors
                                        ${period === p ? 'text-indigo-700 font-semibold bg-indigo-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <a
                    href="/owner/manage-bookings"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    Xem chi tiết
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m14 0-4 4m4-4-4-4" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

export default Dashboard