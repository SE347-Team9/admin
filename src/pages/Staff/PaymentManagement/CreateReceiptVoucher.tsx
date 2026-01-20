import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowLeft } from 'lucide-react';
import './CreateReceiptVoucher.css';

const agencies = [
	{ id: 'A01', name: 'Đại lý Nghĩa' },
	{ id: 'A02', name: 'Đại lý Đại' },
	{ id: 'A03', name: 'Đại lý Minh' },
];

const CreateReceiptVoucher: React.FC = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		agency: '',
		date: new Date().toISOString().split('T')[0],
		amount: '',
		note: ''
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCancel = () => navigate('/staff/payment-management');
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.agency || !formData.date || !formData.amount) {
			alert('Vui lòng điền đầy đủ thông tin!');
			return;
		}
		console.log('Save', formData);
		alert('Lưu phiếu thu thành công!');
		navigate('/staff/payment-management');
	};

	return (
		<div className="create-receiptv2-wrapper">
			<div className="create-receiptv2-header">
				<div className="create-receiptv2-header-icon">
					<DollarSign size={40} />
				</div>
				<div className="create-receiptv2-header-content">
					<h1 className="create-receiptv2-title">Lập Phiếu Thu</h1>
					<p className="create-receiptv2-desc">
						Tạo phiếu thu mới để quản lý các khoản thu của đại lý
					</p>
				</div>
				<button className="create-receiptv2-back-btn" onClick={handleCancel}>
					<ArrowLeft size={20} />
					Quay lại
				</button>
			</div>

			<div className="create-receiptv2-card">
				<form onSubmit={handleSubmit} className="create-receiptv2-form">
					<div className="create-receiptv2-grid">
						<div className="create-receiptv2-group">
							<label htmlFor="agency" className="create-receiptv2-label">
								Đại lý <span>*</span>
							</label>
							<select
								id="agency"
								name="agency"
								value={formData.agency}
								onChange={handleInputChange}
								className="create-receiptv2-input"
							>
								<option value="">Chọn đại lý</option>
								{agencies.map(a => (
									<option key={a.id} value={a.id}>
										{a.name}
									</option>
								))}
							</select>
						</div>
						<div className="create-receiptv2-group">
							<label htmlFor="date" className="create-receiptv2-label">
								Ngày thu tiền <span>*</span>
							</label>
							<input
								type="date"
								id="date"
								name="date"
								value={formData.date}
								onChange={handleInputChange}
								className="create-receiptv2-input"
							/>
						</div>
					</div>
					<div className="create-receiptv2-group">
						<label htmlFor="amount" className="create-receiptv2-label">
							Số tiền thu (VND) <span>*</span>
						</label>
						<input
							type="number"
							id="amount"
							name="amount"
							value={formData.amount}
							onChange={handleInputChange}
							className="create-receiptv2-input"
							placeholder="Nhập số tiền thu"
							min={0}
						/>
					</div>
					<div className="create-receiptv2-group">
						<label htmlFor="note" className="create-receiptv2-label">
							Ghi chú
						</label>
						<textarea
							id="note"
							name="note"
							value={formData.note}
							onChange={handleInputChange}
							className="create-receiptv2-textarea"
							placeholder="Thêm ghi chú cho phiếu thu"
							rows={4}
						/>
					</div>
					<div className="create-receiptv2-actions">
						<button
							type="button"
							className="create-receiptv2-btn create-receiptv2-btn--secondary"
							onClick={handleCancel}
						>
							Hủy bỏ
						</button>
						<button
							type="submit"
							className="create-receiptv2-btn create-receiptv2-btn--primary"
						>
							Lưu phiếu thu
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateReceiptVoucher;




