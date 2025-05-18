// src/components/Services/Pricing.js

const Pricing = () => {
  const pricingData = [
    { service: 'Washing', price: 'Nu. 50 per load' },
    { service: 'Drying', price: 'Nu. 30 per load' },
    { service: 'Ironing', price: 'Nu. 20 per item' },
    { service: 'Express Service', price: 'Nu. 100 per load' },
  ];

  return (
    <div className="pricing-section">
      <h2 className="title">Service Pricing</h2>
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {pricingData.map((item, index) => (
            <tr key={index}>
              <td>{item.service}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .pricing-section {
          max-width: 700px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: #f9f9f9;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }

        .title {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .pricing-table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 0.8rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Pricing;
