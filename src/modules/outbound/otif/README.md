# OTIF Module

The module imports an Excel or CSV source for one Facility ID, aggregates rows
by `TYPE + EXTERNORDERKEY`, and evaluates OTIF using the legacy rules migrated
from the original Apps Script app.

Required source headers: `EXTERNORDERKEY`, `TYPE`, `STORERKEY`, `ORIGINALQTY`,
and `SHIPPEDQTY`.

The browser import adapter is temporary and keeps data in the current workspace.
A future Gateway-backed adapter must use `FacilityOperationalDataAccessPort` and
send Facility ID plus date/range only. It must never expose Spreadsheet ID,
sheet name, or Google Drive URL to this module.
