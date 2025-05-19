import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import networkAdapter from '../../utils/networkAdapter';

const defaultBookings = [];

const BookingManagement = () => {
    const { hotelId } = useParams();
    const [bookings, setBookings] = useState(defaultBookings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (hotelId) {
            fetchBookings(hotelId);
        }
    }, [hotelId]);

    const fetchBookings = async (hotelId) => {
        setLoading(true);
        try {
            const response = await networkAdapter.get(`api/partner/hotels/${hotelId}/bookings`);
            if (response.success) {
                setBookings(response.data);
            } else {
                setError('Không thể tải danh sách đặt phòng');
                setBookings(defaultBookings);
            }
        } catch (err) {
            setError('Lỗi kết nối server');
            setBookings(defaultBookings);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'Đã xác nhận';
            case 'Pending':
                return 'Chờ xác nhận';
            case 'Cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                Danh sách đặt phòng
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đặt phòng</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Ngày nhận phòng</TableCell>
                            <TableCell>Ngày trả phòng</TableCell>
                            <TableCell>Số phòng</TableCell>
                            <TableCell>Số khách</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell>{booking._id}</TableCell>
                                <TableCell>
                                    {booking.userId?.email || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(booking.checkIn), 'dd/MM/yyyy', { locale: vi })}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(booking.checkOut), 'dd/MM/yyyy', { locale: vi })}
                                </TableCell>
                                <TableCell>{booking.rooms}</TableCell>
                                <TableCell>{booking.guests}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(booking.totalPrice)}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusText(booking.status)}
                                        color={getStatusColor(booking.status)}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BookingManagement; 