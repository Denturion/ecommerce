import { useState } from 'react';
import { useCart } from '../components/contexts/CartContext';
import { Title } from '../components/styled/AdminNav';
import { ICreateCustomer } from '../components/types/ICreateCustomer';

import { FormInput, FormLabel } from '../components/styled/FormInput';
import { createOrder } from '../services/orderServices';
import {
	calculateTotalPrice,
	mapCartToOrderItems,
} from '../utils/cartHandlers';
import { createCustomer } from '../services/customerServices';
import { ICreateOrder } from '../components/types/ICreateOrder';

export const CartPage: React.FC = () => {
	const { cart, removeFromCart, setCart } = useCart();
	const [currentStep, setCurrentStep] = useState<
		'cart' | 'customerInfo' | 'orderSummary'
	>('cart');
	const [customerInfo, setCustomerInfo] = useState<ICreateCustomer>({
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		phone: '',
		street_address: '',
		postal_code: '',
		city: '',
		country: '',
	});

	const [error, setError] = useState<string | null>(null);

	const [orderSummary, setOrderSummary] = useState<{
		customer: ICreateCustomer;
		products: typeof cart;
		total: number;
	} | null>(null);

	const handleGoToCheckout = () => {
		setCurrentStep('customerInfo');
	};

	const handleBackToCart = () => {
		setCurrentStep('cart');
	};

	const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCustomerInfo((prev) => ({ ...prev, [name]: value }));
	};

	const validateCustomerInfo = (): boolean => {
		for (const key in customerInfo) {
			if (customerInfo[key as keyof ICreateCustomer].trim() === '') {
				setError('Please fill in all fields.');
				return false;
			}
		}

		setError(null);
		return true;
	};

	const handleQuantityChange = (productId: number, newQuantity: number) => {
		setCart((prevCart) => {
			const updatedCart = prevCart.map((product) =>
				product.id === productId
					? { ...product, quantity: newQuantity }
					: product
			);
			localStorage.setItem('cart', JSON.stringify(updatedCart)); // Sync with localStorage
			return updatedCart;
		});
	};

	const handleSubmitCustomerInfo = async () => {
		if (!validateCustomerInfo()) {
			return;
		}

		try {
			const createdCustomer = await createCustomer({
				firstname: customerInfo.firstname,
				lastname: customerInfo.lastname,
				email: customerInfo.email,
				password: customerInfo.password,
				phone: customerInfo.phone,
				street_address: customerInfo.street_address,
				postal_code: customerInfo.postal_code,
				city: customerInfo.city,
				country: customerInfo.country,
			});

			console.log('Created customer:', createdCustomer);

			const totalPrice = calculateTotalPrice(cart);
			const orderItems = mapCartToOrderItems(cart);

			console.log('Order items:', orderItems);

			const newOrder: ICreateOrder = {
				customer_id: createdCustomer.id,
				total_price: totalPrice,
				payment_status: 'Unpaid',
				order_status: 'Pending',
				customer_firstname: createdCustomer.firstname,
				customer_lastname: createdCustomer.lastname,
				customer_email: createdCustomer.email,
				customer_phone: createdCustomer.phone,
				customer_street_address: createdCustomer.street_address,
				customer_postal_code: createdCustomer.postal_code,
				customer_city: createdCustomer.city,
				customer_country: createdCustomer.country,
				order_items: orderItems,
			};

			console.log('Order being created:', newOrder);

			const createdOrder = await createOrder(newOrder);

			console.log('Order created successfully:', createdOrder);

			// Update the order summary and clear the cart
			setOrderSummary({
				customer: createdCustomer,
				products: cart,
				total: totalPrice,
			});
			setCart([]);
			setCurrentStep('orderSummary');
		} catch (error) {
			console.error('Error placing the order:', error);
			setError('Failed to place the order. Please try again.');
		}
	};

	if (cart.length === 0 && currentStep === 'cart') {
		return <div>Your cart is empty.</div>;
	}

	return (
		<main>
			{currentStep === 'cart' && (
				<div>
					<Title>Your Cart</Title>
					<ul>
						{cart.map((product, index) => (
							<li key={product.id ?? `product-${index}`}>
								<img src={product.image} alt={product.name} />
								<h2>{product.name}</h2>
								<p>{product.description}</p>
								<p>Price: ${product.price}</p>
								<p>
									Quantity:{' '}
									<select
										value={product.quantity || 1}
										onChange={(e) =>
											handleQuantityChange(
												product.id!,
												parseInt(e.target.value, 10)
											)
										}
									>
										{[1, 2, 3, 4, 5].map((qty) => (
											<option key={qty} value={qty}>
												{qty}
											</option>
										))}
									</select>
								</p>
								<button
									onClick={() => product.id && removeFromCart(product.id!)}
								>
									Remove
								</button>
							</li>
						))}
					</ul>
					<button onClick={handleGoToCheckout}>Go to Checkout</button>
				</div>
			)}

			{currentStep === 'customerInfo' && (
				<div>
					<Title>Customer Information</Title>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					<form onSubmit={(e) => e.preventDefault()}>
						<FormLabel>First name</FormLabel>
						<FormInput
							type='text'
							name='firstname'
							placeholder='First Name'
							value={customerInfo.firstname}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Last name</FormLabel>
						<FormInput
							type='text'
							name='lastname'
							placeholder='Last Name'
							value={customerInfo.lastname}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Email</FormLabel>
						<FormInput
							type='email'
							name='email'
							placeholder='Email'
							value={customerInfo.email}
							onChange={handleCustomerInfoChange}
						/>

						<FormLabel>Password</FormLabel>
						<FormInput
							type='password'
							name='password'
							placeholder='Password'
							value={customerInfo.password}
							onChange={handleCustomerInfoChange}
						/>

						<FormLabel>Phone</FormLabel>
						<FormInput
							type='text'
							name='phone'
							placeholder='Phone'
							value={customerInfo.phone}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Street address</FormLabel>
						<FormInput
							type='text'
							name='street_address'
							placeholder='Street Address'
							value={customerInfo.street_address}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Postal code</FormLabel>
						<FormInput
							type='text'
							name='postal_code'
							placeholder='Postal Code'
							value={customerInfo.postal_code}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>City</FormLabel>
						<FormInput
							type='text'
							name='city'
							placeholder='City'
							value={customerInfo.city}
							onChange={handleCustomerInfoChange}
						/>
						<FormLabel>Country</FormLabel>
						<FormInput
							type='text'
							name='country'
							placeholder='Country'
							value={customerInfo.country}
							onChange={handleCustomerInfoChange}
						/>
						<button onClick={handleBackToCart}>Back to Cart</button>
						<button onClick={handleSubmitCustomerInfo}>Place Order</button>
					</form>
				</div>
			)}

			{currentStep === 'orderSummary' && orderSummary && (
				<div>
					<Title>Order Summary</Title>
					<h3>Customer Information</h3>
					<p>
						{orderSummary.customer.firstname} {orderSummary.customer.lastname}
					</p>
					<p>Email: {orderSummary.customer.email}</p>
					<p>Phone: {orderSummary.customer.phone}</p>
					<p>
						Address: {orderSummary.customer.street_address},{' '}
						{orderSummary.customer.postal_code} {orderSummary.customer.city},{' '}
						{orderSummary.customer.country}
					</p>
					<h3>Products</h3>
					<ul>
						{orderSummary.products.map((product) => (
							<li key={product.id || Math.random()}>
								{product.name} - ${product.price} x {product.quantity || 1}
							</li>
						))}
					</ul>
					<h3>Total: ${orderSummary.total.toFixed(2)}</h3>
				</div>
			)}
		</main>
	);
};
