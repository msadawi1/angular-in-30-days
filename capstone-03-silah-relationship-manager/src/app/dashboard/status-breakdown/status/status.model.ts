export interface Status {
    label: "Overdue" | "Due soon" | "Never contacted" | "Up to date"
    value: "overdue" | "due_soon" | "never_contacted" | "on_track"
    count: number
}
