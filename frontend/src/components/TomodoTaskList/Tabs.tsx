const Tabs = () => {
  const tabs = [
    {
      id: 'active-tasks',
      label: 'Active Tasks'
    }, {
      id: 'past-logs',
      label: 'Past Logs'
    }
  ]

  return (
    <div className="inline-flex items-center">
      {
        tabs.map(tabItem => {
          return <button id={tabItem.id} className="px-2 py-1.5">{
            tabItem.label}</button>
        })
      }
    </div>
  )
}

export default Tabs