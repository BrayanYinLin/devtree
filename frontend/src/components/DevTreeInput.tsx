import { Switch } from "@headlessui/react";
import type { DevTreeLink } from "../types";
import { classNames } from "../utils";

type DevTreeInputProps = {
  item: DevTreeLink;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnableLink: (socialNetwork: string) => void;
};

export default function DevTreeInput({
  item,
  handleUrlChange,
  handleEnableLink,
}: DevTreeInputProps) {
  return (
    <div className="bg-white shadow-sm p-5 flex items-center gap-3">
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url('/social/icon_${item.name}).svg` }}
      ></div>
      <input
        type="text"
        className="flex-1 border border-gray-100 rounded-lg"
        value={item.url}
        onChange={handleUrlChange}
        name={item.name}
      />

      <Switch
        checked={item.enable}
        onChange={() => {
          handleEnableLink(item.name);
        }}
        className={classNames(
          item.enable ? "bg-blue-500" : "bg-gray-200",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            item.enable ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>
    </div>
  );
}
