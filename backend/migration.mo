import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Float "mo:core/Float";
import Time "mo:core/Time";

module {
  type OldCommissionEntry = {
    transactionId : Text;
    transactionAmount : Float;
    commissionRate : Float;
    commissionEarned : Float;
    transactionDate : Time.Time;
    merchantName : Text;
    category : Text;
  };

  type OldActor = {
    commissions : Map.Map<Text, OldCommissionEntry>;
  };

  type FrontPhoto = {
    front_id_card_image_name : Text;
    front_id_card_image: Blob;
  };

  type NewCommissionEntry = {
    transactionId : Text;
    transactionAmount : Float;
    commissionRate : Float;
    commissionEarned : Float;
    transactionDate : Time.Time;
    merchantName : Text;
    category : Text;
  };

  type NewActor = {
    commissions : Map.Map<Text, NewCommissionEntry>;
    photos : Map.Map<Nat, FrontPhoto>;
  };

  public func run(old : OldActor) : NewActor {
    { old with photos = Map.empty<Nat, FrontPhoto>() };
  };
};
