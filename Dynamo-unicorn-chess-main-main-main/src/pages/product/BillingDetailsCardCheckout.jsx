import React from 'react';
import { FaMapMarkerAlt } from "react-icons/fa";
const BillingDetailsCardCheckout = ({ data, onCardSelect, selectedId }) => {
    const billingDetails = data || [];

    // Handle clicking a card
    const handleCardClick = (_id) => {
        onCardSelect(_id); // Notify parent component
    };

    return (
        <div className="">
            <div className="row">
                {billingDetails.map((detail) => {
                    const isSelected = selectedId === detail._id; // Determine if this card is selected
                    return (
                        <div
                            className="col-md-12 mb-2"
                            key={detail._id}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <div
                                className="card"
                                onClick={() => handleCardClick(detail._id)}
                                style={{
                                    border: isSelected ? `2px solid #16A54B` : '1px solid #e0e0e0',
                                    borderRadius: '12px',
                                    boxShadow: isSelected
                                        ? '0 4px 10px rgba(22, 165, 75, 0.3)'
                                        : '0 2px 6px rgba(0, 0, 0, 0.1)',
                                    padding: '20px',
                                    width: '100%',
                                    maxWidth: '500px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#E6F9F8' : '#ffffff', // Lighter background for selected
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                }}
                            >
                                {/* Icon / Map Image */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        left: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: '#22C35D',
                                        borderRadius: '50%',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <FaMapMarkerAlt style={{ color: '#fff', fontSize: '20px' }} />

                                </div>

                                {/* Address Details */}
                                <div style={{ marginLeft: '80px' }}>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            color: '#16A54B',
                                            backgroundColor: '#E6F9F8',
                                            padding: '2px 8px',
                                            borderRadius: '5px',
                                            fontWeight: 'bold',
                                            marginBottom: '10px',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {detail.addressType}
                                    </span>
                                    <h5
                                        className="card-title"
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            color: '#333',
                                        }}
                                    >
                                        {detail.name}
                                    </h5>
                                    <p className="card-text" style={{ margin: 0 }}>
                                        {detail.phone}
                                    </p>
                                    <p
                                        className="card-text"
                                        style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginTop: '5px',
                                        }}
                                    >
                                        {detail.address}, {detail.city}, {detail.state} -{' '}
                                        {detail.postcode}
                                    </p>
                                </div>

                                {/* Selection Indicator */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid #16A54B',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: isSelected ? '#16A54B' : 'transparent',
                                        transition: 'background-color 0.2s ease',
                                    }}
                                >
                                    {isSelected && (
                                        <div
                                            style={{
                                                width: '10px',
                                                height: '10px',
                                                backgroundColor: '#ffffff',
                                                borderRadius: '50%',
                                            }}
                                        ></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BillingDetailsCardCheckout;
