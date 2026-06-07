const StatusBadge = ({ status }) => {
  const map = {
    draft: { label: 'Draft', cls: 'badge-pending' },
    active: { label: 'Active', cls: 'badge-ready' },
    sold: { label: 'Sold', cls: 'badge-published' },
    ready: { label: 'Ready', cls: 'badge-ready' },
    needs_attention: { label: 'Needs Attention', cls: 'badge-needs-attention' },
    published: { label: 'Published', cls: 'badge-published' },
    pending: { label: 'Pending', cls: 'badge-pending' },
  }
  const { label, cls } = map[status] || { label: status, cls: 'badge-pending' }
  return <span className={`badge ${cls}`}>{label}</span>
}

export default StatusBadge
