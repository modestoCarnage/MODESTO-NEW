import React from "react";
import { BookNowForm } from "./_components/book-now-form";
import { getOngoingBooks } from "@/lib/booking";

const BookNowPage = async () => {
  const ongoing = await getOngoingBooks();

  return <BookNowForm ongoing={ongoing} />;
};

export default BookNowPage;
