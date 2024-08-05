'use client'

import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

import { useSelection } from '@/hooks/use-selection'
import { UserDto } from '@/gql/__generated__/types'
import { UserFilters } from '@/components/dashboard/users/user-filters'
import assert from 'assert'

interface UsersTableProps {
  count?: number
  page?: number
  users: ReadonlyArray<UserDto>
  rowsPerPage?: number
}

export function UsersTable({ users = [] }: UsersTableProps): React.JSX.Element {
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = React.useState(0)
  const [searchName, setSearchName] = useState('')
  const paginatedUsers = applyPagination(
    filterData(searchName, users),
    page,
    rowsPerPage
  )

  const rowIds = React.useMemo(() => {
    return paginatedUsers.map((user) => user.id)
  }, [paginatedUsers])

  const { selectAll, deselectAll, selectOne, deselectOne, selected } =
    useSelection(rowIds)

  const selectedSome =
    (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < paginatedUsers.length
  const selectedAll =
    paginatedUsers.length > 0 && selected?.size === paginatedUsers.length

  return (
    <>
      <UserFilters
        searchName={searchName}
        setSearchName={setSearchName}
      ></UserFilters>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        selectAll()
                      } else {
                        deselectAll()
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Phone Number</TableCell>
                {/*<TableCell>Groups</TableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((row) => {
                const isSelected = selected?.has(row.id)

                return (
                  <TableRow hover key={row.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.id)
                          } else {
                            deselectOne(row.id)
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    {/*<TableCell>*/}
                    {/*  <Stack*/}
                    {/*    sx={{ alignItems: 'center' }}*/}
                    {/*    direction="row"*/}
                    {/*    spacing={2}*/}
                    {/*  >*/}
                    {/*    <Avatar src={row.avatar} />*/}
                    {/*    <Typography variant="subtitle2">{row.name}</Typography>*/}
                    {/*  </Stack>*/}
                    {/*</TableCell>*/}
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.phoneNumber}</TableCell>
                    {/*<TableCell>{JSON.stringify(row.groups)}</TableCell>*/}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={users.length}
          onPageChange={(event, page) => {
            setPage(page)
          }}
          onRowsPerPageChange={(event) => {
            assert(event.target.value)
            const d = event.target.value as string
            setRowsPerPage(Number(d))
            console.log(rowsPerPage)
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[2, 5, 10, 25]}
        />
      </Card>
    </>
  )
}

function applyPagination(
  rows: ReadonlyArray<UserDto>,
  page: number,
  rowsPerPage: number
): UserDto[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
}

const filterData = (
  searchName: string,
  users: ReadonlyArray<UserDto>
): ReadonlyArray<UserDto> => {
  if (searchName === '') {
    return users
  }
  return users.filter((user) =>
    user.name.toLowerCase().includes(searchName.toLowerCase())
  )
}
