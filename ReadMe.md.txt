# Graft

## A graph based todo list application

Graft allows you to represent you tasks and processes as directed acyclic graphs. The main benefit of this representation of your tasks is a graph naturally captures the dependencies between tasks. This makes setting up and achieving a larger goals much easier. 

Inherently capturing task dependencies allows more complex functionality in Graft. This includes:

* Automated workflows - automate workflows by triggering tasks based on the completion of prerequisite tasks.
* Conditional Logic - the outcome of one task can easily influence the tasks it is linked to.
* Identifying bottleneck - tasks which are the dependencies of many other tasks can be identified as bottlenecks
* Improved planning and time allocation - the edges of the graph can be annotated with time requirements making planning inherently dynamic

## Tech

For the frontend graft uses React and ReactFlow. And on the backend FastApi is used along with a SQL Database