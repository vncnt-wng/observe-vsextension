export const getPlotLyLayout = (title: string, xaxis: string, yaxis: string) => {
    return {
        title: {
            text: title,
            font: {
                size: 14,
                color: "#7f7f7f",
            },
            xref: "paper",
            x: 0.05,
        },
        xaxis: {
            title: {
                text: xaxis,
                font: {
                    size: 12,
                    color: "#707070",
                },
            },
        },
        yaxis: {
            title: {
                text: yaxis,
                font: {
                    size: 12,
                    color: "#707070",
                },
            },
        },
        autoexpand: true,
        margin: {
            l: 45,
            r: 45,
            b: 45,
            t: 45,
            pad: 5,
        },
        paper_bgcolor: "#1E2227",
        plot_bgcolor: "#323842",
    };
};