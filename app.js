const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';  

function fetchStockData() {
    const symbol = document.getElementById('stock-symbol').value.toUpperCase(); 
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data['Time Series (5min)']) {
                const lastRefreshed = data['Meta Data']['3. Last Refreshed'];
                const stockData = data['Time Series (5min)'][lastRefreshed];
                
               
                if (stockData) {
                    const stockPrice = parseFloat(stockData['4. close']); 
                    const previousTimestamp = Object.keys(data['Time Series (5min)'])[1]; 
                    const previousData = data['Time Series (5min)'][previousTimestamp];
                    
            
                    if (previousData) {
                        const previousPrice = parseFloat(previousData['4. close']);
                        const stockChange = ((stockPrice - previousPrice) / previousPrice) * 100;

                        displayStockInfo(symbol, stockPrice, stockChange);
                    } else {
                        alert('Error retrieving previous data.');
                    }
                } else {
                    alert('No data available for the given symbol.');
                }
            } else {
                alert('Stock symbol not found or invalid. Please try again.');
            }
        })
        .catch(error => {
            alert('Error fetching data.');
            console.error(error);
        });
}

function displayStockInfo(symbol, price, change) {
    document.getElementById('stock-info').style.display = 'block';
    document.getElementById('stock-name').textContent = `Stock: ${symbol}`;
    document.getElementById('stock-price').textContent = `Price: $${price.toFixed(2)}`;
    document.getElementById('stock-change').textContent = `Change: ${change.toFixed(2)}%`;
    if (change > 0) {
        document.getElementById('stock-change').style.color = 'green';
    } else if (change < 0) {
        document.getElementById('stock-change').style.color = 'red';
    } else {
        document.getElementById('stock-change').style.color = 'gray';
    }
}
