
function PieChart({ color, percentage }) {
    const pieStyle = {
        '--color': color,
        '--percentage': percentage
    }
    return <div className="pie" style={pieStyle} >{Math.round(percentage)}%</div>
}

function TwoColoredPieChart({ color1, color2, percentage }) {
    const pieStyle = {
        '--color1': color1,
        '--color2': color2,
        '--percentage': percentage
    }
    return <div className="pie twoColors" style={pieStyle} >{Math.round(percentage)}%</div>
}

export { PieChart, TwoColoredPieChart };