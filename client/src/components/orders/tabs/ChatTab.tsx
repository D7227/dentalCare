import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ChatTabProps {
  order: any;
}

const ChatTab: React.FC<ChatTabProps> = ({ order }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-96">
          <div className="p-4 space-y-2">
            {order.messages && order.messages.length > 0 ? (
              order.messages.map((msg: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <Badge variant="secondary">{msg.messageBy}</Badge>
                  <span>{msg.label}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No messages for this order.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatTab; 