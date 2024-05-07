
function dateFormat(datetime)
{
    return datetime.toISOString().slice(0, 10).replace(/-/g, '');
}

export { dateFormat }