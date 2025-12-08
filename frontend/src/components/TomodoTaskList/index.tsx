import Badge from "./Badge"
import Checkmark from "./Checkmark"
import Filter from "./Filter"
import ListItem from "./ListItem"
import ListItemPomoCount from "./ListItemPomoCount"
import ListView from "./ListView"
import Tabs from "./Tabs"

const Root = () => {
  return (
    <div>Root</div>
  )
}

const TomodoTaskList = {
  Root: Root,
  Badge: Badge,
  Checkmark: Checkmark,
  Filter: Filter,
  ListItem: ListItem,
  ListItemPomoCount: ListItemPomoCount,
  ListView: ListView,
  Tabs: Tabs,
}

export default TomodoTaskList