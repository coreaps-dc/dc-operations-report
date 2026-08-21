# SLA Customer

Outbound module for customer SLA summary by DC.

## Import Headers

- `EXTERNORDERKEY`: counted order key
- `TYPE`: order type filter
- `DELAY TIME`: `0` means on time, values greater than `0` mean delay
- `AREA PENGIRIMAN`: delivery area filter
- `SHIPPED DATE`: date filter for day, month, or range analysis

The DC name is inferred from the imported file name.

## Output

The module summarizes:

- `DC HCI`
- `On Time`
- `Delay`
- `SLA`

The backup action exports a spreadsheet-ready CSV including DC territory and BU
config from the app.
