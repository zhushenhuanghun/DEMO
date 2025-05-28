// 雷达图状态显示实现
document.addEventListener('DOMContentLoaded', function() {
    // 创建雷达图容器
    const statusDashboard = document.getElementById('statusDashboard');
    const radarContainer = document.createElement('div');
    radarContainer.id = 'radarChartContainer';
    radarContainer.className = 'radar-chart-container';
    
    // 创建标题
    const radarTitle = document.createElement('h3');
    radarTitle.textContent = '当前核心指标 (2025年初基准)';
    radarTitle.className = 'radar-title';
    radarContainer.appendChild(radarTitle);
    
    // 创建状态指示器
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'status-indicator';
    statusIndicator.textContent = '核心指标状态';
    radarContainer.appendChild(statusIndicator);
    
    // 创建雷达图SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "300");
    svg.setAttribute("viewBox", "-10 -10 420 420");
    svg.setAttribute("class", "radar-chart");
    radarContainer.appendChild(svg);
    
    // 替换原有的状态面板
    statusDashboard.innerHTML = '';
    statusDashboard.appendChild(radarContainer);
    
    // 定义雷达图数据
    const metrics = [
        { name: "财务状况", value: 7 },
        { name: "团队效能", value: 5 },
        { name: "产品竞争力", value: 5 },
        { name: "市场地位", value: 3 },
        { name: "商业模式可行性", value: 3 },
        { name: "愿景实现度", value: 5 }
    ];
    
    // 绘制雷达图
    drawRadarChart(svg, metrics);
    
    // 更新游戏状态时更新雷达图
    const originalUpdateUI = window.updateUI || function() {};
    window.updateUI = function(gameState) {
        // 调用原始的updateUI函数
        originalUpdateUI(gameState);
        
        // 更新雷达图数据
        const updatedMetrics = [
            { name: "财务状况", value: Math.round(gameState.financialHealth / 10) },
            { name: "团队效能", value: Math.round(gameState.teamEffectiveness / 10) },
            { name: "产品竞争力", value: Math.round(gameState.productStrength / 10) },
            { name: "市场地位", value: Math.round(gameState.marketPosition / 10) },
            { name: "商业模式可行性", value: Math.round(gameState.businessViability / 10) },
            { name: "愿景实现度", value: Math.round(gameState.visionExecution / 10) }
        ];
        
        // 清除旧图形
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
        
        // 重新绘制雷达图
        drawRadarChart(svg, updatedMetrics);
        
        // 更新标题年份
        radarTitle.textContent = `当前核心指标 (${gameState.currentYear}年${gameState.phase.split('(')[0].trim()})`;
    };
});

// 绘制雷达图函数
function drawRadarChart(svg, metrics) {
    const svgNS = "http://www.w3.org/2000/svg";
    const centerX = 200;
    const centerY = 200;
    const radius = 180;
    const maxValue = 10;
    const levels = 5; // 5个同心环
    
    // 绘制背景网格
    for (let level = 1; level <= levels; level++) {
        const currentRadius = (radius / levels) * level;
        const polygon = document.createElementNS(svgNS, "polygon");
        let points = "";
        
        for (let i = 0; i < metrics.length; i++) {
            const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
            const x = centerX + currentRadius * Math.cos(angle);
            const y = centerY + currentRadius * Math.sin(angle);
            points += `${x},${y} `;
        }
        
        polygon.setAttribute("points", points);
        polygon.setAttribute("class", "radar-level");
        svg.appendChild(polygon);
        
        // 添加刻度值
        if (level === levels) {
            const valueText = document.createElementNS(svgNS, "text");
            valueText.setAttribute("x", centerX);
            valueText.setAttribute("y", centerY - currentRadius - 5);
            valueText.setAttribute("text-anchor", "middle");
            valueText.setAttribute("class", "radar-scale");
            valueText.textContent = maxValue;
            svg.appendChild(valueText);
        }
    }
    
    // 绘制轴线
    for (let i = 0; i < metrics.length; i++) {
        const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
        const lineX = centerX + radius * Math.cos(angle);
        const lineY = centerY + radius * Math.sin(angle);
        
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", lineX);
        line.setAttribute("y2", lineY);
        line.setAttribute("class", "radar-axis");
        svg.appendChild(line);
        
        // 添加轴标签
        const labelX = centerX + (radius + 20) * Math.cos(angle);
        const labelY = centerY + (radius + 20) * Math.sin(angle);
        
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", labelX);
        text.setAttribute("y", labelY);
        text.setAttribute("text-anchor", angle === -Math.PI / 2 ? "middle" : 
                                       angle < -Math.PI / 2 || angle > Math.PI / 2 ? "end" : "start");
        text.setAttribute("dominant-baseline", angle === Math.PI / 2 ? "hanging" : "middle");
        text.setAttribute("class", "radar-label");
        text.textContent = metrics[i].name;
        svg.appendChild(text);
    }
    
    // 绘制数据多边形
    const dataPolygon = document.createElementNS(svgNS, "polygon");
    let dataPoints = "";
    const dataCircles = [];
    
    for (let i = 0; i < metrics.length; i++) {
        const value = metrics[i].value;
        const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
        const distance = (radius * value) / maxValue;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);
        
        dataPoints += `${x},${y} `;
        
        // 创建数据点
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 5);
        circle.setAttribute("class", "radar-point");
        dataCircles.push(circle);
    }
    
    dataPolygon.setAttribute("points", dataPoints);
    dataPolygon.setAttribute("class", "radar-data");
    svg.appendChild(dataPolygon);
    
    // 添加数据点
    dataCircles.forEach(circle => svg.appendChild(circle));
}