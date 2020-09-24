export function formatCIN(value) {
    var regex = /^([0-9]{3})\s([0-9]{3})\s([0-9]{3})\s([0-9]{3})/;
    return regex.test(value);
}