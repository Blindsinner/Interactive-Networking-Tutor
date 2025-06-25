export default function initObservability() {
    const select = document.getElementById('scenario-select');
    const explanationDiv = document.getElementById('scenario-explanation');
    const chartContainer = document.getElementById('traffic-chart-container');
    
    const scenarios = {
        normal: {
            data: [15, 20, 18, 25, 22, 30, 28, 35, 40, 38, 30, 25],
            explanation: "<strong>Normal Traffic:</strong> This shows typical fluctuations throughout a business day. You see peaks during core working hours and lulls during off-hours. This is a healthy baseline."
        },
        backup: {
            data: [5, 4, 80, 85, 90, 88, 75, 10, 8, 6, 7, 5],
            explanation: "<strong>Nightly Backup:</strong> This pattern is characterized by a massive, sustained spike in traffic during a specific off-hour window (e.g., 2-4 AM). This is expected behavior for large data transfer operations."
        },
        ddos: {
            data: [20, 25, 22, 30, 95, 98, 96, 99, 97, 95, 35, 30],
            explanation: "<strong>DDoS Attack:</strong> This pattern shows a sudden, extreme, and often erratic spike in traffic that goes far beyond normal peak levels. The traffic doesn't follow a predictable pattern and aims to saturate the network link."
        }
    };

    const svg = d3.select("#traffic-chart");
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    
    function drawChart() {
        const containerWidth = chartContainer.clientWidth;
        svg.attr("width", containerWidth);
        const width = containerWidth - margin.left - margin.right;
        const height = parseInt(svg.attr("height")) - margin.top - margin.bottom;

        svg.selectAll("*").remove(); // Clear previous chart

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand().range([0, width]).padding(0.2);
        const y = d3.scaleLinear().range([height, 0]);

        g.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
        g.append("g").attr("class", "y-axis");

        svg.append("text").attr("class", "x-label").attr("transform", `translate(${width / 2 + margin.left},${height + margin.top + 35})`).style("text-anchor", "middle").text("Time Interval");
        svg.append("text").attr("class", "y-label").attr("transform", "rotate(-90)").attr("y", 0).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("Throughput (Mbps)");

        updateChart(select.value, g, x, y, width, height);
    }

    function updateChart(scenario, g, x, y, width, height) {
        const data = scenarios[scenario].data;
        explanationDiv.innerHTML = scenarios[scenario].explanation;

        x.domain(data.map((d, i) => i + 1));
        y.domain([0, 100]); // Fixed Y-axis for better comparison

        g.select(".x-axis").call(d3.axisBottom(x));
        g.select(".y-axis").transition().duration(750).call(d3.axisLeft(y));

        const bars = g.selectAll(".bar").data(data);

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("fill", "var(--accent-primary)")
            .attr("x", (d, i) => x(i + 1))
            .attr("y", y(0))
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .merge(bars)
            .transition().duration(750)
            .attr("x", (d, i) => x(i + 1))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d));

        bars.exit().remove();
    }
    
    select.addEventListener('change', () => drawChart());

    // Initial and responsive chart render
    drawChart();
    window.addEventListener('resize', drawChart);
}