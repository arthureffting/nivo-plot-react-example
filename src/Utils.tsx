
export const getMean = function (data: number[]) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / data.length;
};

export const getStdDeviation = function (data: number[]) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
        return sq + Math.pow(n - m, 2);
    }, 0) / (data.length - 1));
};
