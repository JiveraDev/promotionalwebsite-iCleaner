
import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import usersData from './data/users.json'
import airDusterImg from './assets/product-air-duster.svg'
import brushImg from './assets/product-brush.svg'
import microfiberImg from './assets/product-microfiber.svg'
import sprayImg from './assets/product-spray.svg'
import swabsImg from './assets/product-swabs.svg'
import matImg from './assets/product-mat.svg'
import logoImg from './assets/icleaner-logo.png'
import receiptPreviewImg from './assets/receipt-preview.svg'
import './App.css'

const products = [
  {
    id: 'air-duster',
    name: 'Electric Air Duster',
    tag: 'Dust removal',
    price: 29,
    image: airDusterImg,
    description:
      'High-velocity air stream to clear vents, fans, and tight keyboard gaps without moisture.',
  },
  {
    id: 'antistatic-brush',
    name: 'Anti-Static Detail Brush',
    tag: 'Safe detailing',
    price: 12,
    image: brushImg,
    description:
      'Soft ESD-safe bristles lift debris from ports, heat sinks, and motherboard edges.',
  },
  {
    id: 'microfiber-kit',
    name: 'Microfiber Wipe Kit',
    tag: 'Screen-safe',
    price: 9,
    image: microfiberImg,
    description:
      'Lint-free microfiber cloths for screens, bezels, and device shells.',
  },
  {
    id: 'ipa-spray',
    name: 'Electronics Cleaning Spray',
    tag: 'Residue-free',
    price: 14,
    image: sprayImg,
    description:
      'IPA-based cleaning mist for plastics and metal surfaces. Use sparingly.',
  },
  {
    id: 'precision-swabs',
    name: 'Precision Swab Set',
    tag: 'Tight spots',
    price: 8,
    image: swabsImg,
    description:
      'Pointed swabs for ports, hinge lines, and keyboard crevices.',
  },
  {
    id: 'cleaning-mat',
    name: 'Magnetic Work Mat',
    tag: 'Organization',
    price: 18,
    image: matImg,
    description:
      'Keep screws and tools sorted during deeper laptop cleaning.',
  },
]

const benefits = [
  {
    title: 'ESD-conscious tools',
    body: 'Every brush and wipe is designed for electronics-safe handling.',
  },
  {
    title: 'Fast, dry cleaning',
    body: 'Air and microfiber remove dust without soaking your device.',
  },
  {
    title: 'Buyer-ready bundles',
    body: 'Curated kits for home, classroom, and repair desks.',
  },
]

const steps = [
  {
    title: 'Select your kit',
    body: 'Pick essentials or build a custom cart in the buyer portal.',
  },
  {
    title: 'Choose payment',
    body: 'Pay via QR transfer or upload a receipt for seller verification.',
  },
  {
    title: 'Seller approves',
    body: 'We verify the receipt image and confirm fulfillment.',
  },
]

const checkoutSteps = [
  { id: 1, title: 'Products', path: '/buyer/products' },
  { id: 2, title: 'Build Order', path: '/buyer/order' },
  { id: 3, title: 'Checkout', path: '/buyer/checkout' },
]

const sampleReceipts = [
  {
    id: 'REC-2914',
    buyer: 'Avery Chen',
    amount: 64.0,
    status: 'Pending review',
    submitted: 'Today, 10:42 AM',
    image: receiptPreviewImg,
  },
  {
    id: 'REC-2841',
    buyer: 'Mina Patel',
    amount: 38.0,
    status: 'Verified',
    submitted: 'Yesterday, 6:12 PM',
    image: receiptPreviewImg,
  },
]

const sampleFeedbacks = {
  'air-duster': [
    { name: 'Avery C.', rating: 5, comment: 'Blows dust out fast. Very strong.' },
    { name: 'Jamie R.', rating: 4, comment: 'Great for vents, a bit loud.' },
  ],
  'antistatic-brush': [
    { name: 'Mina P.', rating: 5, comment: 'Perfect for ports and tiny gaps.' },
    { name: 'Jordan K.', rating: 4, comment: 'Soft bristles, no scratches.' },
  ],
  'microfiber-kit': [
    { name: 'Luis M.', rating: 4, comment: 'Streak-free on screens.' },
    { name: 'Priya S.', rating: 5, comment: 'Cloths feel premium.' },
  ],
  'ipa-spray': [
    { name: 'Ethan W.', rating: 4, comment: 'Cleans residue without marks.' },
    { name: 'Rosa L.', rating: 5, comment: 'Light mist, dries quickly.' },
  ],
  'precision-swabs': [
    { name: 'Kai T.', rating: 4, comment: 'Great for tight keyboard gaps.' },
    { name: 'Nina F.', rating: 5, comment: 'Super precise tips.' },
  ],
  'cleaning-mat': [
    { name: 'Dario V.', rating: 5, comment: 'Keeps screws in place.' },
    { name: 'Sophia H.', rating: 4, comment: 'Nice texture, easy to wipe.' },
  ],
}

const sellerProducts = [
  { name: 'Air Duster + Microfiber Bundle', stock: '42 available' },
  { name: 'Precision Swab Refill Pack', stock: '118 available' },
  { name: 'Mat + Brush Kit', stock: '29 available' },
]

const sellerUpdates = [
  'Reviewing 2 new receipts',
  '3 orders ready for fulfillment',
  'Next payout scheduled Friday',
]

const accountTips = [
  'Use your email or username to sign in.',
  'Buyer accounts can place orders and rate products.',
  'Seller accounts review receipts and approve orders.',
]

function App() {
  const [users, setUsers] = useState(usersData)
  const [authMessage, setAuthMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
    role: 'buyer',
  })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  })
  const [quantities, setQuantities] = useState(() =>
    products.reduce((acc, item) => {
      acc[item.id] = 0
      return acc
    }, {}),
  )
  const [paymentMethod, setPaymentMethod] = useState('qr')
  const [receiptFile, setReceiptFile] = useState(null)
  const [orderConfirmation, setOrderConfirmation] = useState(null)
  const [reviews, setReviews] = useState(() =>
    products.reduce((acc, item) => {
      acc[item.id] = { rating: 0, comment: '' }
      return acc
    }, {}),
  )

  const total = useMemo(() => {
    return products.reduce((sum, item) => {
      return sum + item.price * (quantities[item.id] || 0)
    }, 0)
  }, [quantities])

  const selectedCount = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  }, [quantities])

  const orderItems = useMemo(() => {
    return products
      .map((item) => ({
        ...item,
        qty: quantities[item.id],
      }))
      .filter((item) => item.qty > 0)
  }, [quantities])

  const handleQtyChange = (id, value) => {
    const nextValue = Number.isNaN(value) ? 0 : Math.max(0, value)
    setQuantities((prev) => ({
      ...prev,
      [id]: nextValue,
    }))
  }

  const handleLogin = (event) => {
    event.preventDefault()
    const match = users.find((user) => {
      const identifierMatch =
        user.username === loginForm.identifier ||
        user.email === loginForm.identifier
      return (
        identifierMatch &&
        user.password === loginForm.password &&
        user.role === loginForm.role
      )
    })

    if (!match) {
      setAuthMessage('No match found. Check your role and credentials.')
      return
    }

    setCurrentUser(match)
    setAuthMessage(`Welcome back, ${match.name}.`)
  }

  const handleRegister = (event) => {
    event.preventDefault()
    const exists = users.some(
      (user) =>
        user.username === registerForm.username ||
        user.email === registerForm.email,
    )

    if (exists) {
      setAuthMessage('That username or email is already in use.')
      return
    }

    const newUser = {
      id: `${registerForm.role}-${Date.now()}`,
      name: registerForm.name || 'New User',
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      role: registerForm.role,
    }

    setUsers((prev) => [...prev, newUser])
    setCurrentUser(newUser)
    setAuthMessage(`Account created for ${newUser.name}.`)
    setRegisterForm({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'buyer',
    })
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setAuthMessage('Signed out.')
  }

  const submitOrder = () => {
    const orderId = `IC-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderConfirmation({
      id: orderId,
      total,
      items: orderItems,
      paymentMethod,
      receiptName: receiptFile?.name || null,
    })
  }

  return (
    <BrowserRouter>
      <div className="page">
        <SiteHeader currentUser={currentUser} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                benefits={benefits}
                products={products}
                steps={steps}
              />
            }
          />
          <Route
            path="/buyer/*"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="buyer">
                <BuyerPortal
                  products={products}
                  quantities={quantities}
                  selectedCount={selectedCount}
                  total={total}
                  orderItems={orderItems}
                  paymentMethod={paymentMethod}
                  receiptFile={receiptFile}
                  setPaymentMethod={setPaymentMethod}
                  setReceiptFile={setReceiptFile}
                  handleQtyChange={handleQtyChange}
                  submitOrder={submitOrder}
                  orderConfirmation={orderConfirmation}
                  reviews={reviews}
                  setReviews={setReviews}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller"
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="seller">
                <SellerPortal receipts={sampleReceipts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                users={users}
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                handleLogin={handleLogin}
                authMessage={authMessage}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/register"
            element={
              <RegisterPage
                registerForm={registerForm}
                setRegisterForm={setRegisterForm}
                handleRegister={handleRegister}
                authMessage={authMessage}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <SiteFooter currentUser={currentUser} />
      </div>
    </BrowserRouter>
  )
}

function ProtectedRoute({ currentUser, requiredRole, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <div className="panel access-denied">
        <h3>Access restricted</h3>
        <p className="order-sub">This area is for seller accounts only.</p>
        <Link className="primary" to="/login">
          Sign in as seller
        </Link>
      </div>
    )
  }
  return children
}

function SiteHeader({ currentUser, onLogout }) {
  const location = useLocation()
  const hideHero =
    location.pathname === '/login' || location.pathname === '/register'

  return (
    <header className="hero">
      <nav className="nav">
        <div className="brand">
          <img className="logo" src={logoImg} alt="iCleaner logo" />
          <div>
            <p className="brand-name">iCleaner</p>
            <p className="brand-tag">Laptop + gadget cleaning kit</p>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          {currentUser ? (
            <button className="ghost" onClick={onLogout}>
              Log out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={location.pathname === '/login' ? 'active' : ''}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={location.pathname === '/register' ? 'active' : ''}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {hideHero ? null : (
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Device cleaners • tools • materials</p>
            <h1>Modern cleaning kits for laptops and desktops.</h1>
            <p className="lead">
              Safe brushes, microfiber, and dust-removal tools built for
              electronics. Keep workstations clean without moisture or residue.
            </p>
            <div className="hero-actions">
              <Link className="primary" to="/buyer/products">
                Shop as buyer
              </Link>
              <Link className="ghost" to="/seller">
                Seller portal
              </Link>
            </div>
            <div className="hero-badges">
              <span>ESD-conscious</span>
              <span>Screen-safe</span>
              <span>Fast fulfillment</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function LandingPage({ benefits, products, steps }) {
  return (
    <>
      <section className="section" aria-label="Benefits">
        <div className="section-title">
          <p>Why teams choose iCleaner</p>
          <h2>Everything you need to clean without risk.</h2>
        </div>
        <div className="grid three">
          {benefits.map((item) => (
            <article className="tile" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-label="Products">
        <div className="section-title">
          <p>Featured tools</p>
          <h2>Cleaners, brushes, and air tools.</h2>
        </div>
        <div className="grid three">
          {products.map((item) => (
            <article className="product" key={item.id}>
              <img className="product-image" src={item.image} alt="" />
              <div className="product-head">
                <span>{item.tag}</span>
                <p>${item.price}</p>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-label="How it works">
        <div className="section-title">
          <p>How it works</p>
          <h2>Simple flow for buyers and sellers.</h2>
        </div>
        <div className="grid three">
          {steps.map((item) => (
            <article className="tile" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function BuyerPortal({
  products,
  quantities,
  selectedCount,
  total,
  orderItems,
  paymentMethod,
  receiptFile,
  setPaymentMethod,
  setReceiptFile,
  handleQtyChange,
  submitOrder,
  orderConfirmation,
  reviews,
  setReviews,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentStep = checkoutSteps.find(
    (step) => step.path === location.pathname,
  )
  const stepId = currentStep?.id ?? 1

  const goNext = () => {
    if (stepId === 2 && selectedCount === 0) {
      return
    }
    const nextStep = checkoutSteps.find((step) => step.id === stepId + 1)
    if (nextStep) {
      navigate(nextStep.path)
    }
  }

  const goBack = () => {
    const prevStep = checkoutSteps.find((step) => step.id === stepId - 1)
    if (prevStep) {
      navigate(prevStep.path)
    }
  }

  const handleConfirm = () => {
    submitOrder()
  }

  const addToOrder = (id) => {
    const currentQty = quantities[id] || 0
    handleQtyChange(id, currentQty + 1)
  }

  return (
    <section className="section buyer" aria-label="Buyer portal">
      <div className="section-title">
        <p>Buyer portal</p>
        <h2>Browse products, build orders, and checkout.</h2>
      </div>
      <div className="checkout-steps">
        {checkoutSteps.map((step) => (
          <Link
            key={step.id}
            to={step.path}
            className={`step ${stepId === step.id ? 'active' : ''}`}
          >
            <span>{step.id}</span>
            <p>{step.title}</p>
          </Link>
        ))}
      </div>
      <div className="buyer-grid">
        <div className="panel">
          {stepId === 1 && (
            <>
              <h3>Buyer product view</h3>
              <p>Browse each item like a marketplace listing and leave feedback.</p>
              <div className="shop-list">
                {products.map((item) => {
                  const sampleList = sampleFeedbacks[item.id] || []
                  const userRating = Number(reviews[item.id]?.rating) || 0
                  const ratingPool = [
                    ...sampleList.map((entry) => entry.rating),
                    ...(userRating ? [userRating] : []),
                  ]
                  const averageRating = ratingPool.length
                    ? ratingPool.reduce((sum, rating) => sum + rating, 0) /
                      ratingPool.length
                    : 0
                  const roundedStars = Math.max(
                    0,
                    Math.min(5, Math.round(averageRating)),
                  )
                  const filledStars = '★'.repeat(roundedStars)
                  const emptyStars = '☆'.repeat(5 - roundedStars)
                  const ratingLabel = ratingPool.length
                    ? `${averageRating.toFixed(1)}/5`
                    : 'New'
                  const currentQty = quantities[item.id] || 0

                  return (
                    <article className="shop-card" key={item.id}>
                      <div className="shop-media">
                        <img className="shop-image" src={item.image} alt="" />
                        <span className="shop-badge">{item.tag}</span>
                      </div>
                      <div className="shop-body">
                        <div className="shop-header">
                          <div>
                            <h3>{item.name}</h3>
                            <p className="shop-sub">{item.description}</p>
                          </div>
                          <div className="shop-price">${item.price}</div>
                        </div>
                        <div className="shop-rating">
                          <span
                            className="stars"
                            aria-label={`Rated ${roundedStars} out of 5`}
                          >
                            {filledStars}
                            {emptyStars}
                          </span>
                          <span className="rating-value">{ratingLabel}</span>
                        </div>
                        <div className="shop-feedback">
                          <p className="order-sub">Buyer feedback</p>
                          <div className="feedback-list">
                            {sampleList.map((entry, index) => (
                              <div className="feedback-item" key={entry.name + index}>
                                <strong>{entry.name}</strong> · {entry.rating}/5
                                <div>{entry.comment}</div>
                              </div>
                            ))}
                            {reviews[item.id]?.comment ? (
                              <div className="feedback-item">
                                <strong>You</strong> · {userRating || 0}/5
                                <div>{reviews[item.id].comment}</div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="shop-actions">
                          <label className="rating-label">
                            Rating (1-5)
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={reviews[item.id]?.rating || ''}
                              onChange={(event) =>
                                setReviews((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    rating: Number(event.target.value),
                                  },
                                }))
                              }
                            />
                          </label>
                          <label className="rating-label">
                            Feedback
                            <textarea
                              rows="3"
                              value={reviews[item.id]?.comment || ''}
                              onChange={(event) =>
                                setReviews((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    comment: event.target.value,
                                  },
                                }))
                              }
                              placeholder="Share your experience."
                            />
                          </label>
                          <div className="shop-cta">
                            <button
                              className="ghost"
                              type="button"
                              onClick={() => addToOrder(item.id)}
                            >
                              Add to order
                            </button>
                            <p className="order-sub">In cart: {currentQty}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}
          {stepId === 2 && (
            <>
              <h3>Build your order</h3>
              <p>Pick quantities for each tool kit.</p>
              <div className="order-list">
                {products.map((item) => (
                  <div className="order-row" key={item.id}>
                    <div>
                      <p className="order-title">{item.name}</p>
                      <p className="order-sub">${item.price} each</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={quantities[item.id]}
                      onChange={(event) =>
                        handleQtyChange(item.id, Number(event.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="order-summary">
                <div>
                  <p>Items selected</p>
                  <p className="summary-value">{selectedCount}</p>
                </div>
                <div>
                  <p>Estimated total</p>
                  <p className="summary-value">${total.toFixed(2)}</p>
                </div>
              </div>
            </>
          )}
          {stepId === 3 && (
            <>
              <h3>Checkout</h3>
              <p>Choose payment and confirm your order.</p>
              <div className="summary-list">
                {orderItems.length === 0 ? (
                  <p className="order-sub">No items selected.</p>
                ) : (
                  orderItems.map((item) => (
                    <div className="summary-row" key={item.id}>
                      <span>{item.name}</span>
                      <span>
                        {item.qty} × ${item.price}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="summary-total">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <div className="payment-options">
                <label className="radio">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'qr'}
                    onChange={() => setPaymentMethod('qr')}
                  />
                  QR transfer (instant)
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'receipt'}
                    onChange={() => setPaymentMethod('receipt')}
                  />
                  Upload receipt for seller approval
                </label>
              </div>
              {paymentMethod === 'qr' ? (
                <div className="qr-block">
                  <div className="qr-placeholder" aria-hidden="true"></div>
                  <div>
                    <p className="qr-title">Scan to pay</p>
                    <p className="qr-sub">Seller wallet: IC-SELLER-8821</p>
                  </div>
                </div>
              ) : (
                <div className="receipt-block">
                  <label className="upload">
                    Upload receipt image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setReceiptFile(event.target.files[0])}
                    />
                  </label>
                  <p className="receipt-status">
                    {receiptFile ? receiptFile.name : 'No file selected yet.'}
                  </p>
                  <p className="receipt-note">
                    Seller verifies the image before confirming the order.
                  </p>
                </div>
              )}
              <button
                className="primary full"
                onClick={handleConfirm}
                disabled={orderItems.length === 0}
              >
                Confirm order
              </button>
              {orderConfirmation && (
                <div className="confirmation">
                  <h4>Order received</h4>
                  <p>
                    Confirmation ID: <strong>{orderConfirmation.id}</strong>
                  </p>
                  <p>
                    Seller verification in progress. We will notify you when
                    approved.
                  </p>
                </div>
              )}
            </>
          )}
          <div className="step-actions">
            <button className="ghost" onClick={goBack} disabled={stepId === 1}>
              Back
            </button>
            {stepId < 3 ? (
              <button
                className="primary"
                onClick={goNext}
                disabled={stepId === 2 && selectedCount === 0}
              >
                Continue
              </button>
            ) : null}
          </div>
        </div>
        <div className="panel">
          <h3>Checkout summary</h3>
          <p>At-a-glance totals for your current cart.</p>
          <div className="summary-card">
            <div>
              <p className="order-sub">Items</p>
              <p className="summary-value">{selectedCount}</p>
            </div>
            <div>
              <p className="order-sub">Total</p>
              <p className="summary-value">${total.toFixed(2)}</p>
            </div>
            <div>
              <p className="order-sub">Payment</p>
              <p className="summary-value">
                {paymentMethod === 'qr' ? 'QR' : 'Receipt'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
function SellerPortal({ receipts }) {
  const [activeTab, setActiveTab] = useState('receipts')

  return (
    <section className="section seller" aria-label="Seller portal">
      <div className="section-title">
        <p>Seller workspace</p>
        <h2>Verify receipts, approve orders, and manage inventory.</h2>
      </div>
      <div className="seller-grid">
        <div className="panel">
          <div className="seller-tabs">
            <button
              className={activeTab === 'receipts' ? 'active' : ''}
              onClick={() => setActiveTab('receipts')}
            >
              Receipts
            </button>
            <button
              className={activeTab === 'products' ? 'active' : ''}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
          </div>
          {activeTab === 'receipts' ? (
            <div className="receipt-list">
              {receipts.map((receipt) => (
                <div className="receipt-item" key={receipt.id}>
                  <img
                    className="receipt-preview"
                    src={receipt.image}
                    alt="Receipt preview"
                  />
                  <div>
                    <p className="order-title">{receipt.buyer}</p>
                    <p className="order-sub">
                      {receipt.id} · ${receipt.amount.toFixed(2)}
                    </p>
                    <p className="order-sub">Submitted {receipt.submitted}</p>
                  </div>
                  <div className="seller-actions">
                    <span className="status-chip">{receipt.status}</span>
                    <button className="primary">Open</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="product-list">
              {sellerProducts.map((item) => (
                <div className="seller-product" key={item.name}>
                  <div>
                    <p className="order-title">{item.name}</p>
                    <p className="order-sub">{item.stock}</p>
                  </div>
                  <button className="ghost">Edit</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="panel">
          <h3>Seller pulse</h3>
          <p>Quick health checks for today.</p>
          <div className="seller-card">
            <ul className="demo-list">
              {sellerUpdates.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function LoginPage({
  users,
  loginForm,
  setLoginForm,
  handleLogin,
  authMessage,
  currentUser,
}) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      return
    }
    const target =
      currentUser.role === 'seller' ? '/seller' : '/buyer/products'
    navigate(target, { replace: true })
  }, [currentUser, navigate])

  return (
    <section className="section account" aria-label="Login">
      <div className="section-title">
        <p>Account access</p>
        <h2>Sign in to manage your buyer or seller workspace.</h2>
      </div>
      <div className="account-grid stack">
        <div className="panel">
          <form className="form" onSubmit={handleLogin}>
            <label>
              Email or username
              <input
                type="text"
                value={loginForm.identifier}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    identifier: event.target.value,
                  }))
                }
                placeholder="name@company.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </label>
            <label>
              Role
              <select
                value={loginForm.role}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, role: event.target.value }))
                }
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </label>
            <button className="primary" type="submit">
              Sign in
            </button>
            {authMessage ? <p className="status">{authMessage}</p> : null}
          </form>
        </div>
        <div className="panel account-card">
          <p className="account-label">Demo users</p>
          <ul className="demo-list">
            {users.map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong> · {user.role}
                <div className="order-sub">{user.email}</div>
                <div className="order-sub">Password: {user.password}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function RegisterPage({
  registerForm,
  setRegisterForm,
  handleRegister,
  authMessage,
}) {
  return (
    <section className="section account" aria-label="Register">
      <div className="section-title">
        <p>Create account</p>
        <h2>Set up a buyer or seller profile in minutes.</h2>
      </div>
      <div className="account-grid">
        <div className="panel">
          <form className="form" onSubmit={handleRegister}>
            <label>
              Full name
              <input
                type="text"
                value={registerForm.name}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="Alex Rivera"
              />
            </label>
            <label>
              Username
              <input
                type="text"
                value={registerForm.username}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }
                placeholder="alex.clean"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                placeholder="alex@icleaner.io"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="Create a password"
                required
              />
            </label>
            <label>
              Role
              <select
                value={registerForm.role}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, role: event.target.value }))
                }
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </label>
            <button className="primary" type="submit">
              Create account
            </button>
            {authMessage ? <p className="status">{authMessage}</p> : null}
          </form>
        </div>
        <div className="panel account-card">
          <p className="account-label">Getting started</p>
          <ul className="demo-list">
            {accountTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function SiteFooter({ currentUser }) {
  return (
    <footer className="footer">
      <div>
        <p className="brand-name">iCleaner</p>
        <p className="footer-sub">
          {currentUser
            ? `Signed in as ${currentUser.name} · ${currentUser.role}`
            : 'Clean devices. Confident buyers. Faster fulfillment.'}
        </p>
      </div>
      <div className="footer-links">
        <Link to="/buyer/products">Buyer portal</Link>
        <Link to="/seller">Seller portal</Link>
        <Link to="/register">Create account</Link>
      </div>
    </footer>
  )
}

export default App

