import Float "mo:core/Float";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Migration "migration";
import Nat "mo:core/Nat";

(with migration = Migration.run)
actor {
  type CommissionEntry = {
    transactionId : Text;
    transactionAmount : Float;
    commissionRate : Float;
    commissionEarned : Float;
    transactionDate : Time.Time;
    merchantName : Text;
    category : Text;
  };

  module CommissionEntry {
    public func calculateCommission(amount : Float, rate : Float) : Float {
      amount * rate / 100.0;
    };
  };

  type FrontPhoto = {
    front_id_card_image_name : Text;
    front_id_card_image: Blob;
  };

  let commissions = Map.empty<Text, CommissionEntry>();
  let photos = Map.empty<Nat, FrontPhoto>();

  public type Stats = {
    totalTransactions : Nat;
    totalTransactionVolume : Float;
    totalCommissionEarned : Float;
    averageCommissionRate : Float;
  };

  public shared ({ caller }) func addPhoto(
    id : Nat,
    photo : FrontPhoto,
  ) : async () {
    photos.add(id, photo);
  };

  public query ({ caller }) func getPhoto(id : Nat) : async ?FrontPhoto {
    photos.get(id);
  };

  public query ({ caller }) func getAllPhotos() : async [FrontPhoto] {
    photos.values().toArray();
  };

  public shared ({ caller }) func deletePhoto(id : Nat) : async () {
    let idExists = photos.containsKey(id);
    if (not idExists) {
      Runtime.trap("Photo does not exist");
    };

    photos.remove(id);
  };

  public shared ({ caller }) func addCommission(
    transactionId : Text,
    transactionAmount : Float,
    commissionRate : Float,
    transactionDate : Time.Time,
    merchantName : Text,
    category : Text,
  ) : async () {
    if (commissions.containsKey(transactionId)) {
      Runtime.trap("Transaction with this ID already exists");
    };

    let commissionEarned = CommissionEntry.calculateCommission(transactionAmount, commissionRate);
    let entry : CommissionEntry = {
      transactionId;
      transactionAmount;
      commissionRate;
      commissionEarned;
      transactionDate;
      merchantName;
      category;
    };

    commissions.add(transactionId, entry);
  };

  public shared ({ caller }) func deleteCommission(transactionId : Text) : async () {
    if (not commissions.containsKey(transactionId)) {
      Runtime.trap("Transaction not found");
    };
    commissions.remove(transactionId);
  };

  public query ({ caller }) func getStats() : async Stats {
    let entries = commissions.values().toArray();
    let totalTransactions = entries.size();

    let (totalTransactionVolume, totalCommissionEarned, totalCommissionRate) = entries.foldLeft(
      (0.0, 0.0, 0.0),
      func(acc, entry) {
        let (volume, earned, rate) = acc;
        (volume + entry.transactionAmount, earned + entry.commissionEarned, rate + entry.commissionRate);
      },
    );

    let averageCommissionRate = if (totalTransactions > 0) {
      totalCommissionRate / totalTransactions.toInt().toFloat();
    } else {
      0.0;
    };

    {
      totalTransactions;
      totalTransactionVolume;
      totalCommissionEarned;
      averageCommissionRate;
    };
  };

  public query ({ caller }) func getAllCommissions() : async [CommissionEntry] {
    commissions.values().toArray();
  };
};
