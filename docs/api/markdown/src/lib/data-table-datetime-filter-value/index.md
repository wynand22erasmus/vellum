# src/lib/data-table-datetime-filter-value

Serialization helpers for date/datetime column filter values.

Filter values are stored as ISO 8601 strings (`YYYY-MM-DD` for date-only,
full ISO for datetime) so they interoperate with API row timestamps.

## Type Aliases

- [DateFilterDraftParts](type-aliases/DateFilterDraftParts.md)
- [DateFilterGranularity](type-aliases/DateFilterGranularity.md)

## Functions

- [buildDateFilterDraft](functions/buildDateFilterDraft.md)
- [dateFilterInputType](functions/dateFilterInputType.md)
- [datetimeLocalToFilterValue](functions/datetimeLocalToFilterValue.md)
- [filterValueToDatetimeLocal](functions/filterValueToDatetimeLocal.md)
- [formatDateFilterDisplayValue](functions/formatDateFilterDisplayValue.md)
- [parseDateFilterDraft](functions/parseDateFilterDraft.md)
