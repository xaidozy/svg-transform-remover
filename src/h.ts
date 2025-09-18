export function roundValue(value: number): number {
	// 使用6位小数精度，避免过度舍入
	return parseFloat(value.toFixed(6));
}
