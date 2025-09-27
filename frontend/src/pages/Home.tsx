import { useItemsStats } from "@/hooks/itemQueries";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ErrorMessage from "../components/error-message";
import Loading from "../components/loading";

function Home() {
  const statsQuery = useItemsStats();
  const stats = statsQuery.data;

  if (statsQuery.isError) return <ErrorMessage message={statsQuery.error.message} />
  if (statsQuery.isLoading || !stats) return <Loading />

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray">Total Items</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl">{stats.count}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Min Price</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl">${(+stats.min_price).toFixed(2)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Price</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl">${(+stats.avg_price).toFixed(2)}</CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Max Price</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl">${(+stats.max_price).toFixed(2)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Price</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl">${(+stats.price_total).toFixed(2)}</CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Total Pieces</CardTitle>
        </CardHeader>
        <CardContent className="text-4xl">{stats.total_pieces}</CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Items Total Price</CardTitle>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stats.total_price_to_item_title?.map((item) => (

                <TableRow key={item.title}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{(+item.quantity)}</TableCell>
                  <TableCell>${(+item.price).toFixed(2)}</TableCell>
                  <TableCell>${(+item.total_price).toFixed(2)}</TableCell>
                </TableRow>

              ))}
            </TableBody>

          </Table>

        </CardContent>
      </Card>
    </div>
  )
}

export default Home;
